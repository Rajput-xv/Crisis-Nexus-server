const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const DonationResource = require('../models/DonationResource');
const User = require('../models/User'); // Assuming you have a User model
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth'); // Import the auth middleware

const updateUserLevel = async (userProfile) => {
  const newLevel = Math.floor(userProfile.points / 100) + 1;
  if (userProfile.level !== newLevel) {
    userProfile.level = newLevel;
    await userProfile.save();
  }
};

// Create a new resource donation
router.post('/', async (req, res) => {
  try {
    const { item, quantity, donor } = req.body;

    // Find the resource by name
    let resource = await Resource.findOne({ name: item });

    if (resource) {
      // Update the quantity of the existing resource
      resource.quantity += quantity;
      resource.lastUpdated = Date.now();
    } else {
      // Create a new resource
      resource = new Resource({
        name: item,
        type: 'donated', // Assuming a default type for donated resources
        quantity,
        location: {
          type: 'Point',
          coordinates: [] // Provide default coordinates if necessary
        },
        status: 'available', // Default status
        lastUpdated: Date.now()
      });
    }

    await resource.save(); // Ensure the resource is saved

    // Create a new DonationResource entry
    const donationResource = new DonationResource({
      donor,
      item,
      quantity
    });

    await donationResource.save();

    // Update user points
    const userProfile = await UserProfile.findOne({ user: donor });
    if (userProfile) {
        const pointsToAdd = Math.floor(quantity / 10) * 5; // Calculate points based on quantity
        userProfile.points += pointsToAdd;
        await userProfile.save();
        await updateUserLevel(userProfile); // Update user level based on points
    }

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a resource
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;