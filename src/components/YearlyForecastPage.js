import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const YearlyForecastPage = () => {
  const { year } = useParams(); // Get year from URL params
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year }),
        });

        if (!response.ok) throw new Error("Failed to fetch forecast data");

        const data = await response.json();
        setForecastData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [year]);

  return (
    <div>
      <h1>Monthly Forecast for {year}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecastData && forecastData.monthly_level && (
        <div>
          <h3>Monthly Forecast</h3>
          <ul>
            {Object.entries(forecastData.monthly_level).map(([month, level]) => (
              <li key={month}>
                {month}: Level = {level}, Storage = {forecastData.monthly_storage[month]}
              </li>
            ))}
          </ul>
          <h4>{forecastData.total_storage}</h4>
        </div>
      )}
    </div>
  );
};

export default YearlyForecastPage;
