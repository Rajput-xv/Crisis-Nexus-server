const mongoose = require('mongoose');

const VerificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema);