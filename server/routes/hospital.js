const router = require('express').Router();
const Hospital = require('../models/Hospital');

router.get("/", async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: "Something broke!" });
    }
});

router.get("/:city", async (req, res) => {
    const city = req.params.city;

    try {
        const hospitalsInCity = await Hospital.find({ city: new RegExp(city, 'i') });
        if (hospitalsInCity.length === 0) {
            return res.status(404).json({ message: "No hospitals found in this city" });
        }
        res.json(hospitalsInCity);
    } catch (err) {
        res.status(500).json({ message: "Something broke!" });
    }
});

module.exports = router;