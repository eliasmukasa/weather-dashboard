// src/components/CurrentWeather.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// This import path has been corrected to use the standard Font Awesome icon set path.
import { FaTemperatureHigh, FaWind, FaTint, FaClock } from 'react-icons/fa';

// The data structure from the API includes a 'dt' timestamp
interface WeatherData {
  name: string;
  dt: number; // This is a Unix timestamp
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
    // We only want to run this effect if a city is provided.
    if (!city) return;

    const fetchWeatherData = async () => {
      // Reset state for new fetches
      setWeatherData(null);
      setError(null);
      
      // Access the API key from environment variables
      const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

      if (!apiKey) {
        setError("API Key is missing. Please check your .env.local file.");
        return;
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (err) {
        setError(`Failed to fetch current weather for '${city}'.`);
        console.error(err);
      }
    };

    fetchWeatherData();
  }, [city, units]); // This effect re-runs whenever the city or units change

  // Helper function to format the timestamp into a readable time
  const formatUpdateTime = (timestamp: number) => {
    // The API provides time in seconds, but the JavaScript Date object needs milliseconds
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Conditional rendering for error state
  if (error) {
    return <div className="weather-card error-card"><p>{error}</p></div>;
  }
  
  // Conditional rendering for loading state
  if (!weatherData) {
    // You can replace this with your skeleton loader component if you have one
    return <div className="weather-card loading"><p>Loading current weather...</p></div>;
  }

  // Main component render once data is available
  return (
    <div className="weather-card current-weather">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <h3 style={{ marginTop: 0, marginRight: '1rem' }}>Current Weather in {weatherData.name}</h3>
        {/* --- THIS IS THE NEW TIMESTAMP DISPLAY --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#adb5bd' }}>
            <FaClock />
            <span>Updated: {formatUpdateTime(weatherData.dt)}</span>
        </div>
      </div>

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
