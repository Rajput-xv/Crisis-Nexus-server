const router = require('express').Router();
const axios = require('axios');

router.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query; // Change to match frontend query parameters

    console.log("Received request for nearby hospitals:", { lat, lng });

    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    try {
        const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        const radius = 50000; // Search within 50km radius
        const includedTypes = ["hospital"];
        const maxResultCount = 20;

        const url = `https://places.googleapis.com/v1/places:searchNearby`;

        const requestBody = {
            locationRestriction: {
                circle: {
                    center: {
                        latitude: parseFloat(lat), // Use `lat` and `lng` here
                        longitude: parseFloat(lng)
                    },
                    radius: radius
                }
            },
            includedTypes,
            maxResultCount
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.websiteUri,places.location'
        };

        console.log("Requesting Google Places API:", { url, requestBody, headers });

        const response = await axios.post(url, requestBody, { headers });
        console.log("Response from Google Places API:", response.data);

        if (!response.data.places || response.data.places.length === 0) {
            return res.status(404).json({ message: "No nearby hospitals found" });
        }

        // Refine the response to include only the required fields
        const refinedPlaces = response.data.places.map(place => ({
            name: place.displayName?.text || 'N/A',
            address: place.formattedAddress || 'N/A',
            types: place.types || [],
            website: place.websiteUri || 'N/A',
            lat: place.location?.latitude ? parseFloat(place.location.latitude) : null,
            lng: place.location?.longitude ? parseFloat(place.location.longitude) : null
        }));

        res.json({ places: refinedPlaces });
    } catch (err) {
        console.error("Error fetching nearby hospitals:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
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
        console.error("Error fetching hospitals by city:", err);
        res.status(500).json({ message: "Something broke!" });
    }
});

module.exports = router;