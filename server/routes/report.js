const express = require('express');
const router = express.Router();
const Incident = require('../models/IncidentReport');
const { v4: uuidv4 } = require('uuid');

router.post('/report', async (req, res) => {
  try {
    const { incidentType, otherIncident, incidentDate, incidentLocation, incidentDescription, affectedIndividuals, incidentStatus, urgency } = req.body;
    const incidentId = uuidv4();

    const newIncident = new Incident({
      incidentId,
      incidentType,
      otherIncident,
      incidentDate,
      incidentLocation: JSON.parse(incidentLocation),
      incidentDescription,
      affectedIndividuals,
      incidentStatus,
      urgency
    });

    await newIncident.save();
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add GET method to fetch incidents
router.get('/report', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;