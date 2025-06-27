// src/App.tsx

import React, { useState } from 'react';
import './App.css';
import CurrentWeather from './components/CurrentWeather';
import ForecastChart from './ForecastChart';
import UnitToggle from './components/UnitToggle';

function App() {
  const [city, setCity] = useState<string>('Atlanta');
  const [inputValue, setInputValue] = useState<string>('Atlanta');
  const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');

  const handleSearch = () => {
    if (inputValue.trim()) {
      setCity(inputValue);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Weather Dashboard</h1>
        <UnitToggle units={units} onToggle={setUnits} />
      </header>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <main className="dashboard-content">
        <CurrentWeather city={city} units={units} />
        <ForecastChart city={city} units={units} />
      </main>
    </div>
  );
}

export default App;
