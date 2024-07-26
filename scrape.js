const axios = require('axios');
const cheerio = require('cheerio');

// Map of conditions to icons
const conditionToIcon = {
    'Fair': 'sunny.png',
    'Sunny': 'sunny.png',
    'Partly Cloudy': 'sunny.png',
    'Mostly Cloudy': 'cloudy.png',
    'Cloudy': 'cloudy.png',
    'Rain': 'rain.png',
    'Snow': 'snowy.png',
    'Windy': 'windy.png',
    'Hot': 'hot.png',
    'Cold': 'cold.png'
};

// Function to get weather data
async function getWeatherData(lat, lon) {
    const url = `https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lon}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract weather data from the HTML
        const currentConditions = $('#current-conditions-body');
        const condition = currentConditions.find('.myforecast-current').text().trim();
        const temperatureF = currentConditions.find('.myforecast-current-lrg').text().trim();
        const temperatureC = currentConditions.find('.myforecast-current-sm').text().trim();

        const humidity = currentConditions.find('td:contains("Humidity")').next().text().trim();
        const windSpeed = currentConditions.find('td:contains("Wind Speed")').next().text().trim();
        const barometer = currentConditions.find('td:contains("Barometer")').next().text().trim();
        const dewpoint = currentConditions.find('td:contains("Dewpoint")').next().text().trim();
        const visibility = currentConditions.find('td:contains("Visibility")').next().text().trim();
        const lastUpdate = currentConditions.find('td:contains("Last update")').next().text().trim();

        // Determine the appropriate icon
        const icon = conditionToIcon[condition] || 'sunny.png';

        // Return the extracted data
        return {
            condition,
            temperature: {
                fahrenheit: temperatureF,
                celsius: temperatureC
            },
            humidity,
            windSpeed,
            barometer,
            dewpoint,
            visibility,
            lastUpdate,
            image: `https://ethansweatherbucket.s3.eu-central-1.amazonaws.com/weather-icons/${icon}`
        };
    } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
        throw error;
    }
}

module.exports = {
    getWeatherData,
};
