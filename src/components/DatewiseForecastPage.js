import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DatewiseForecastPage = () => {
  const { selectedDate } = useParams(); // Get selected date from URL params
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
          body: JSON.stringify({ selected_date: selectedDate }),
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
  }, [selectedDate]);

  return (
    <div>
      <h1>15-Day Forecast starting from {selectedDate}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecastData && forecastData.datewise_level && (
        <div>
          <h3>15-Day Forecast</h3>
          <ul>
            {Object.entries(forecastData.datewise_level).map(([date, level]) => (
              <li key={date}>
                {date}: Level = {level}, Storage = {forecastData.datewise_storage[date]}
              </li>
            ))}
          </ul>
          <h4>{forecastData.total_storage}</h4>
        </div>
      )}
    </div>
  );
};

export default DatewiseForecastPage;
