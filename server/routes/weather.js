const router = require('express').Router();
const { getWeatherData } = require('../services/weatherService');

router.get('/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const { type } = req.query;
    const weatherData = await getWeatherData(lat, lon, type);
    res.json(weatherData);
  } catch (error) {
    console.error('Error in weather route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;