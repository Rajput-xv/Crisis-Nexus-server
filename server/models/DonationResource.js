const mongoose = require('mongoose');

const DonationResourceSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  donatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationResource', DonationResourceSchema);