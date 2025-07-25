const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');
const { saveVerificationCode, verifyCode, sendVerificationEmail, isEmailVerified } = require('../services/emailService');

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

    // Generate code and save in memory
    const code = await saveVerificationCode(email);

    // Send email
    await sendVerificationEmail(email, code);

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ 
      message: 'Failed to send verification code' 
    });
  } 
});

// Verify code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }
    
    const result = await verifyCode(email, code);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ 
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
     if (!isEmailVerified(email)) {
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
    
    // Check for admin credentials first
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { 
          id: 'admin',
          email: adminEmail,
          role: 'admin'
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      return res.json({
        token,
        user: {
          id: 'admin',
          email: adminEmail,
          username: process.env.ADMIN_USERNAME,
          role: 'admin'
        }
      });
    }
    
    // Regular user login
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