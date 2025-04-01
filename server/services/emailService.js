const bcrypt = require('bcryptjs');
const VerificationCode = require('../models/VerificationCode');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Generates a 6-digit verification code
 * @returns {number} - A random 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Saves a hashed verification code in the database
 * @param {string} email - User's email
 * @returns {Promise<number>} - The generated verification code
 */
const saveVerificationCode = async (email) => {
  const code = generateVerificationCode();
  const hashedCode = await bcrypt.hash(code.toString(), 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

  let verificationEntry = await VerificationCode.findOne({ email });

  if (verificationEntry) {
    verificationEntry.code = hashedCode;
    verificationEntry.expiresAt = expiresAt;
    verificationEntry.verified = false;
  } else {
    verificationEntry = new VerificationCode({
      email,
      code: hashedCode,
      expiresAt,
      verified: false
    });
  }

  await verificationEntry.save();
  return code; // Return original code for email sending
};

/**
 * Sends a verification email with the provided code
 * @param {string} email - The recipient's email
 * @param {number} code - The verification code to send
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}. This code will expire in 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Verifies if the provided code is correct
 * @param {string} email - User's email
 * @param {string} code - User-provided verification code
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const verifyCode = async (email, code) => {
  const verificationEntry = await VerificationCode.findOne({ email });

  if (!verificationEntry) {
    return { success: false, message: 'No verification code found' };
  }

  if (new Date() > verificationEntry.expiresAt) {
    return { success: false, message: 'Verification code expired' };
  }

  const isMatch = await bcrypt.compare(code.toString(), verificationEntry.code);
  if (!isMatch) {
    return { success: false, message: 'Invalid verification code' };
  }

  verificationEntry.verified = true;
  await verificationEntry.save();

  return { success: true, message: 'Email verified successfully' };
};

module.exports = {
  saveVerificationCode,
  verifyCode,
  sendVerificationEmail
};
