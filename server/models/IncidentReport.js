const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    incidentId: { type: String, required: true },
  incidentType: { type: String, required: true },
  otherIncident: { type: String },
  incidentDate: { type: Date, required: true },
  incidentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  incidentDescription: { type: String, required: true },
  affectedIndividuals: { type: Number, required: true },
  incidentStatus: { type: String, required: true },
  urgency: { type: String, required: true }
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;