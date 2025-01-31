const axios = require('axios');
require('dotenv').config();

const formatWeatherData = (data, type) => {
  if (type === 'current') {
    return {
      temperature: data.main.temp,
      temperature_min: data.main.temp_min,
      temperature_max: data.main.temp_max,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
    };
  } else if (type === 'hourly') {
    return data.hourly.map(hour => ({
      dt: hour.dt,
      temperature: hour.temp,
      feels_like: hour.feels_like,
      humidity: hour.humidity,
      pressure: hour.pressure,
      wind_speed: hour.wind_speed,
      description: hour.weather[0].description,
    }));
  } else if (type === 'daily') {
    return data.daily.map(day => ({
      dt: day.dt,
      temperature: day.temp.day,
      temperature_min: day.temp.min,
      temperature_max: day.temp.max,
      feels_like: day.feels_like.day,
      humidity: day.humidity,
      pressure: day.pressure,
      wind_speed: day.wind_speed,
      description: day.weather[0].description,
      sunrise: day.sunrise,
      sunset: day.sunset,
    }));
  }
};

const getWeatherData = async (latitude, longitude, type) => {
  try {
    let url;
    let params = {
      lat: latitude,
      lon: longitude,
      appid: process.env.OPENWEATHER_API_KEY,
      units: 'metric'
    };

    if (type === 'current') {
      url = `https://api.openweathermap.org/data/2.5/weather`;
    }else if (type === 'hourly') {
      url = `https://api.openweathermap.org/data/3.0/onecall`;
      params.exclude = 'current,minutely,daily,alerts';
    } else if (type === 'daily') {
      url = `https://api.openweathermap.org/data/3.0/onecall`;
      params.exclude = 'current,minutely,hourly,alerts';
    }

    const response = await axios.get(url, { params });
    return formatWeatherData(response.data, type);
  } catch (error) {
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { getWeatherData };