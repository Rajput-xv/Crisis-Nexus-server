const router = require('express').Router();
const axios = require('axios');

router.get('/nearby', async (req, res) => {
    const { name } = req.query; // Expecting a name or property from the frontend

    console.log("Received request for nearby hospitals based on name:", { name });

    if (!name) {
        return res.status(400).json({ message: "Name or property is required" });
    }

    try {
        const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

        // Step 1: Fetch latitude and longitude using the name or property
        const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;
        const findPlaceParams = {
            input: name,
            inputtype: 'textquery',
            fields: 'geometry',
            key: apiKey
        };

        console.log("Requesting Google Places API for location:", { findPlaceUrl, findPlaceParams });

        const findPlaceResponse = await axios.get(findPlaceUrl, { params: findPlaceParams });
        console.log("Response from Google Places API (findPlaceFromText):", findPlaceResponse.data);

        if (!findPlaceResponse.data.candidates || findPlaceResponse.data.candidates.length === 0) {
            return res.status(404).json({ message: "No location found for the given name" });
        }

        const { lat, lng } = findPlaceResponse.data.candidates[0].geometry.location;

        // Step 2: Use the fetched latitude and longitude to find nearby hospitals
        const radius = 50000; // Search within 50km radius
        const includedTypes = ["hospital"];
        const maxResultCount = 20;

        const searchNearbyUrl = `https://places.googleapis.com/v1/places:searchNearby`;

        const requestBody = {
            locationRestriction: {
                circle: {
                    center: {
                        latitude: lat,
                        longitude: lng
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
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.websiteUri,places.location' // Added places.location
        };

        // console.log("Requesting Google Places API for nearby hospitals:", { searchNearbyUrl, requestBody, headers });

        const response = await axios.post(searchNearbyUrl, requestBody, { headers });
        // console.log("Response from Google Places API (searchNearby):", response.data);

        if (!response.data.places || response.data.places.length === 0) {
            return res.status(404).json({ message: "No nearby hospitals found" });
        }

        // Refine the response to include only the required fields
        const refinedPlaces = response.data.places.map(place => ({
            name: place.displayName?.text || 'N/A',
            address: place.formattedAddress || 'N/A',
            types: place.types || [],
            website: place.websiteUri || 'N/A',
            lat: place.location?.latitude ? parseFloat(place.location.latitude) : null, // Convert to number or null
            lng: place.location?.longitude ? parseFloat(place.location.longitude) : null, // Convert to number or null
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