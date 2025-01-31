const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['available', 'in-use', 'depleted'], default: 'available' },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', ResourceSchema);