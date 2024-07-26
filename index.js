const express = require('express');
const cors = require('cors');
const { getWeatherData } = require('./scrape');

const app = express();
const port = process.env.PORT || 3300;
app.use(cors());

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).send({ error: `Please provide latitude and longitude for ${lat} and ${lon}` });
    }

    try {
        const weatherData = await getWeatherData(lat, lon);
        res.send(weatherData);
    } catch (error) {
        console.error(`Error fetching weather data for lat: ${lat} and lon: ${lon}`, error);
        res.status(500).send({ error: `Failed to fetch weather data for lat: ${lat} and long: ${lon}`, details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Weather API listening at http://localhost:${port}`);
});
