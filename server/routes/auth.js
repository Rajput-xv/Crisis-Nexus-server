const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const VerificationCode = require('../models/VerificationCode');
const auth = require('../middleware/auth');
const { saveVerificationCode, verifyCode, sendVerificationEmail } = require('../services/emailService');

// Send verification code
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate 6-digit code
    const code = await saveVerificationCode(email);

    // Send email
    await sendVerificationEmail(email, code)
      .catch(error => {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send verification email');
      });

    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to send verification code' 
    });
  }
});

// Verify code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await verifyCode(email, code);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Verification failed' 
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check email verification
    const verificationEntry = await VerificationCode.findOne({ email });
    if (!verificationEntry?.verified) {
      return res.status(400).json({ message: 'Email verification required' });
    }

    // Check existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    // Create profile
    const userProfile = new UserProfile({
      user: user._id,
      points: 10,
      level: 1
    });
    await userProfile.save();

    // Cleanup verification entry
    await VerificationCode.deleteOne({ email });

    // Generate token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Registration failed' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user route
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;