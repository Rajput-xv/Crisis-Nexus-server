const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const DonationResource = require('../models/DonationResource');
const IncidentReport = require('../models/IncidentReport');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if provided credentials match admin credentials from env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if ((username === adminUsername || email === adminEmail) && password === adminPassword) {
      // Create admin token
      const token = jwt.sign(
        { 
          id: 'admin',
          username: adminUsername,
          email: adminEmail,
          role: 'admin'
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: {
          id: 'admin',
          username: adminUsername,
          email: adminEmail,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalIncidents = await IncidentReport.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalResources = await Resource.countDocuments();
    
    const activeIncidents = await IncidentReport.countDocuments({ 
      incidentStatus: { $in: ['active', 'pending'] }
    });
    const closedIncidents = await IncidentReport.countDocuments({ 
      incidentStatus: { $in: ['closed', 'resolved', 'inactive'] }
    });
    
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() }
    });
    
    res.json({
      totalUsers,
      totalEvents,
      totalIncidents,
      totalDonations,
      totalResources,
      activeIncidents,
      closedIncidents,
      upcomingEvents
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users with detailed information
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userProfile = await UserProfile.findOne({ user: user._id });
        const donations = await Donation.find({ donor: user._id });
        const resourceDonations = await DonationResource.find({ donor: user._id });
        const registeredEvents = await Event.find({ 
          registeredParticipants: user._id 
        }).countDocuments();
        
        const totalMoneyDonated = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
        const totalResourcesDonated = resourceDonations.reduce((sum, resource) => sum + resource.quantity, 0);
        
        return {
          ...user.toObject(),
          profile: userProfile,
          totalMoneyDonated,
          totalResourcesDonated,
          registeredEventsCount: registeredEvents,
          donations: donations.length,
          resourceDonations: resourceDonations.length
        };
      })
    );
    
    res.json(usersWithDetails);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all incidents with filtering options
router.get('/incidents', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) {
      filter.incidentStatus = status;
    }
    
    const incidents = await IncidentReport.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await IncidentReport.countDocuments(filter);
    
    res.json({
      incidents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update incident status
router.put('/incidents/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const incident = await IncidentReport.findByIdAndUpdate(
      req.params.id,
      { incidentStatus: status },
      { new: true }
    );
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    console.error('Error updating incident status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/events', adminAuth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all events for admin
router.get('/events', adminAuth, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('registeredParticipants', 'username email')
      .sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single event for editing
router.get('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredParticipants', 'username email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user donations and resources details
router.get('/users/:id/donations', adminAuth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.params.id });
    const resourceDonations = await DonationResource.find({ donor: req.params.id });
    
    res.json({
      moneyDonations: donations,
      resourceDonations
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
