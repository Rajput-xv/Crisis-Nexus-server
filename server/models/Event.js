const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['workshop', 'drill', 'training'], required: true },
  date: { type: Date, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  capacity: Number,
  registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);