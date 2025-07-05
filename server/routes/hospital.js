const router = require('express').Router();
const axios = require('axios');

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

router.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query; // Change to match frontend query parameters

    console.log("Received request for nearby hospitals:", { lat, lng });

    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
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

        // console.log("Requesting Google Places API:", { url, requestBody, headers });

        const response = await axios.post(url, requestBody, { headers });
        // console.log("Response from Google Places API:", response.data);

        // console.log(response.data.places.location);

        if (!response.data.places || response.data.places.length === 0) {
            return res.status(404).json({ message: "No nearby hospitals found" });
        }

        // Refine the response to include only the required fields and calculate distances
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        
        const refinedPlaces = response.data.places.map(place => {
            const hospitalLat = place.location?.latitude ? parseFloat(place.location.latitude) : null;
            const hospitalLng = place.location?.longitude ? parseFloat(place.location.longitude) : null;
            
            // Calculate distance from user location
            const distance = (hospitalLat && hospitalLng) 
                ? calculateDistance(userLat, userLng, hospitalLat, hospitalLng)
                : null;
            
            return {
                name: place.displayName?.text || 'N/A',
                address: place.formattedAddress || 'N/A',
                types: place.types || [],
                website: place.websiteUri || 'N/A',
                lat: hospitalLat,
                lng: hospitalLng,
                distance: distance ? Math.round(distance * 100) / 100 : null // Round to 2 decimal places
            };
        });

        // Sort hospitals by distance (closest first)
        const sortedHospitals = refinedPlaces
            .filter(hospital => hospital.distance !== null) // Filter out hospitals without valid coordinates
            .sort((a, b) => a.distance - b.distance);

        res.json({ places: sortedHospitals });
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