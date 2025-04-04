const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile'); // Assuming you have a UserProfile model

const updateUserLevel = async (userProfile) => {
  const newLevel = Math.floor(userProfile.points / 100) + 1;
  if (userProfile.level !== newLevel) {
    userProfile.level = newLevel;
    await userProfile.save();
  }
};

router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    // Update user points
    const userProfile = await UserProfile.findOne({ user: donation.donor });
    if (userProfile) {
      const pointsToAdd = Math.floor(donation.amount / 100) * 10; // Calculate points based on donation amount
      userProfile.points += pointsToAdd;
      await userProfile.save();
      await updateUserLevel(userProfile); // Update user level based on points
    } else {
      console.log(`UserProfile not found for user ${donation.donor}`);
    }

    res.status(201).json(donation);
  } catch (error) {
    console.error('Error processing donation:', error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const donations = await Donation.find({donor: userId});
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;