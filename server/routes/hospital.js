const router = require('express').Router();
const hospitals = require('../models/Hospital');

router.get("/", (req, res) => {
    return res.json(hospitals);
});

router.get("/:city", (req, res) => {
    const city = req.params.city;

    const hospitalsInCity = hospitals.filter(
        (hospital) => hospital.city.toLowerCase() === city.toLowerCase()
    );

    if (hospitalsInCity.length === 0) {
        return res.status(404).json({ message: "No hospitals found in this city" });
    }

    return res.json(hospitalsInCity);
});


module.exports = router;