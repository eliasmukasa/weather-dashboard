// src/components/CurrentWeather.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTemperatureHigh, FaWind, FaTint } from 'react-icons/fa';

// Type is now defined locally again
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

interface CurrentWeatherProps {
  city: string;
  units: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city, units }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const unitSymbol = units === 'metric' ? '°C' : '°F';
  const speedSymbol = units === 'metric' ? 'm/s' : 'mph';

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setWeatherData(null);
      setError(null);
      const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

      if (!apiKey) {
        setError("API Key is missing.");
        return;
      }

      try {
        // Reverted to the simpler URL logic
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (err) {
        setError(`Failed to fetch current weather for '${city}'.`);
        console.error(err);
      }
    };

    fetchWeatherData();
  }, [city, units]); // Reverted dependency array

  if (error) return <div className="weather-card error-card"><p>{error}</p></div>;
  if (!weatherData) {
    return (
      <div className="weather-card current-weather">
        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
        <div className="main-info">
          <span className="skeleton skeleton-text" style={{ width: '120px', height: '4rem' }}></span>
          <span className="skeleton skeleton-text" style={{ width: '150px' }}></span>
        </div>
        <div className="details">
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card current-weather">
      <h3>Current Weather in {weatherData.name}</h3>
      <div className="main-info">
        <span className="temperature">{Math.round(weatherData.main.temp)}{unitSymbol}</span>
        <span className="description">{weatherData.weather[0].description}</span>
      </div>
      <div className="details">
        <div className="detail-item">
            <FaTemperatureHigh />
            <span>Feels Like: {Math.round(weatherData.main.feels_like)}{unitSymbol}</span>
        </div>
        <div className="detail-item">
            <FaTint />
            <span>Humidity: {weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
            <FaWind />
            <span>Wind: {weatherData.wind.speed.toFixed(1)} {speedSymbol}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;