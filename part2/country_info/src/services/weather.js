import axios from "axios";

const appid = process.env.REACT_APP_API_KEY;
const locationBaseUrl = "http://api.openweathermap.org/geo/1.0/direct";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const iconBaseUrl = "https://openweathermap.org/img/wn";

const get = async (city) => {
  if (!appid) {
    console.log("REACT_APP_API_KEY not set");

    return null;
  }

  try {
    const locationParams = {
      q: city,
      limit: 1,
      appid,
    };

    const locationResult = await axios.get(locationBaseUrl, {
      params: locationParams,
    });

    const { lat, lon } = locationResult.data[0];
    const weatherParams = {
      lat,
      lon,
      appid,
      units: "metric",
    };

    const weatherResult = await axios.get(weatherBaseUrl, {
      params: weatherParams,
    });

    return {
      temperature: weatherResult.data.main.temp,
      wind: weatherResult.data.wind.speed,
      icon: `${iconBaseUrl}/${weatherResult.data.weather[0].icon}@2x.png`,
    };
  } catch (e) {
    console.error(e);
  }

  return null;
};

const service = { get };

export default service;
