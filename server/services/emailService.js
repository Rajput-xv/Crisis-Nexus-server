const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Email setup
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

// In-memory verification code store
// Structure: { email => { code, expiresAt } }
const verificationCodes = new Map();

/**
 * Generates a 6-digit verification code
 * @returns {number} - A random 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Saves a verification code in memory
 * @param {string} email - User's email
 * @returns {Promise<number>} - The generated verification code
 */
const saveVerificationCode = async (email) => {
  const code = generateVerificationCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
  
  verificationCodes.set(email, {
    code: code.toString(),
    expiresAt
  });
  
  return code;
};

/**
 * Sends a verification email with the provided code
 * @param {string} email - The recipient's email
 * @param {number} code - The verification code to send
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, code) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = 'Your Crisis Nexus Verification Code';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4a6ee0;">Crisis Nexus Verification</h2>
      <p>Thank you for registering with Crisis Nexus. Please use the verification code below to complete your registration:</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h1 style="font-size: 32px; margin: 0; color: #333;">${code}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, you can safely ignore this email.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">Crisis Nexus - Making a difference together</p>
    </div>
  `;
  sendSmtpEmail.sender = { 
    name: process.env.SENDER_NAME || 'Crisis Nexus', 
    email: process.env.SENDER_EMAIL || 'yash44365@gmail.com' 
  };
  sendSmtpEmail.to = [{ email }];

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully');
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Verifies if the provided code is correct
 * @param {string} email - User's email
 * @param {string} code - User-provided verification code
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const verifyCode = async (email, code) => {
  // Clean up expired codes
  cleanupExpiredCodes();
  
  const verification = verificationCodes.get(email);
  
  if (!verification) {
    return { success: false, message: 'No verification code found. Please request a new code.' };
  }
  
  if (Date.now() > verification.expiresAt) {
    verificationCodes.delete(email);
    return { success: false, message: 'Verification code expired. Please request a new code.' };
  }
  
  if (verification.code !== code.toString()) {
    return { success: false, message: 'Invalid verification code. Please try again.' };
  }
  
  // Mark as verified by setting a verified flag
  verification.verified = true;
  verificationCodes.set(email, verification);
  
  return { success: true, message: 'Email verified successfully' };
};

/**
 * Check if an email is verified
 * @param {string} email - User's email
 * @returns {boolean} - Whether the email is verified
 */
const isEmailVerified = (email) => {
  const verification = verificationCodes.get(email);
  return verification && verification.verified === true;
};

/**
 * Clean up expired verification codes
 */
const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupExpiredCodes, 10 * 60 * 1000);

module.exports = {
  saveVerificationCode,
  sendVerificationEmail,
  verifyCode,
  isEmailVerified
};