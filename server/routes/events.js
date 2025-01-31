const router = require('express').Router();
const Event = require('../models/Event');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');

const updateUserLevel = async (userProfile) => {
  const newLevel = Math.floor(userProfile.points / 100) + 1;
  if (userProfile.level !== newLevel) {
    userProfile.level = newLevel;
    await userProfile.save();
  }
};

// Create a new event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }).populate('registeredParticipants', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register for an event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registeredParticipants.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }
    if (event.registeredParticipants.some(participant => participant.equals(req.userId))) {
      return res.status(400).json({ message: 'Already registered' });
    }
    event.registeredParticipants.push(req.userId);
    await event.save();

    // Award 5 points for registration
    const userProfile = await UserProfile.findOne({ user: req.userId });
    if (userProfile) {
      userProfile.points += 5;
      await userProfile.save();
      await updateUserLevel(userProfile); // Update user level based on points
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance for an event
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.registeredParticipants.some(participant => participant.equals(req.userId))) {
      return res.status(400).json({ message: 'User not registered for this event' });
    }

    // Award 20 points for attending the event
    const userProfile = await UserProfile.findOne({ user: req.userId });
    if (userProfile) {
      userProfile.points += 20;
      await userProfile.save();
      await updateUserLevel(userProfile); // Update user level based on points
    }

    res.json({ message: 'Attendance marked and points awarded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest events
router.get('/latest', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }).limit(5);
    res.json(events);
  } catch (error) {
    console.error('Error fetching latest events:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;