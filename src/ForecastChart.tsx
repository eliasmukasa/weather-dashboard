// src/ForecastChart.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastChartProps {
  city: string;
  units: 'metric' | 'imperial';
}

const ForecastChart: React.FC<ForecastChartProps> = ({ city, units }) => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    const fetchForecastData = async () => {
      setForecastData(null);
      setError(null);
      const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

      if (!apiKey) {
        setError("API Key is missing.");
        return;
      }
      
      try {
        // Reverted to the simpler URL logic
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
        const response = await axios.get(url);

        if (response.data && response.data.list) {
          const dailyData = response.data.list
            .filter((item: any) => item.dt_txt.includes('12:00:00'))
            .slice(0, 5);

          const processedData = {
            labels: dailyData.map((item: any) => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [
              {
                label: `Avg Temp (${units === 'metric' ? '°C' : '°F'})`,
                data: dailyData.map((item: any) => item.main.temp),
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
              },
              {
                label: `Feels Like (${units === 'metric' ? '°C' : '°F'})`,
                data: dailyData.map((item: any) => item.main.feels_like),
                fill: false,
                borderColor: '#E4A0F7',
                tension: 0.1,
              },
            ],
          };
          setForecastData(processedData);
        } else {
          setError("Received an unexpected data format from the weather API.");
        }
      } catch (err) {
        setError("Failed to fetch forecast data.");
        console.error(err);
      }
    };

    fetchForecastData();
  }, [city, units]); // Reverted dependency array

  if (error) return <div className="weather-card error-card"><p>{error}</p></div>;
  if (!forecastData) {
    return (
      <div className="weather-card">
        <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '1rem' }}></div>
        <div className="skeleton skeleton-box" style={{ height: '300px' }}></div>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <h3>5-Day Forecast</h3>
      <div style={{ position: 'relative', height: '300px' }}>
        <Line data={forecastData} options={{ maintainAspectRatio: false, responsive: true }} />
      </div>
    </div>
  );
};

export default ForecastChart;