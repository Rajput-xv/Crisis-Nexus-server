const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  rating: { type: Number, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true }
});

module.exports = mongoose.model('Hospital', HospitalSchema);