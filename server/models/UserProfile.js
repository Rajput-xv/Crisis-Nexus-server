const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  badges: [String],
  level: { type: Number, default: 1 }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);