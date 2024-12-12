import React, { useState } from "react";

const TimeSimulation = () => {
  const [isMonthlyStorage, setIsMonthlyStorage] = useState(true);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const fetchForecast = async (type) => {
    setLoading(true);
    setError(null);

    const body =
      type === "year"
        ? { year: selectedYear }
        : { selected_date: selectedDate };

    try {
      const response = await fetch("http://localhost:5000/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  return (
    <div>
      <h1>Time Simulation</h1>

      {/* Toggle between Yearly and Datewise */}
      <button onClick={() => setIsMonthlyStorage(true)}>Yearly Forecast</button>
      <button onClick={() => setIsMonthlyStorage(false)}>Datewise Forecast</button>

      {/* Yearly Forecast */}
      {isMonthlyStorage && (
        <div>
          <h3>Enter a Year</h3>
          <input
            type="number"
            placeholder="e.g., 2028"
            value={selectedYear}
            onChange={handleYearChange}
          />
          <button onClick={() => fetchForecast("year")}>
            Get Monthly Forecast
          </button>

          {forecastData && forecastData.monthly_level && (
            <div>
              <h3>Monthly Forecasts for {forecastData.year}</h3>
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
      )}

      {/* Datewise Forecast */}
      {!isMonthlyStorage && (
        <div>
          <h3>Select a Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <button onClick={() => fetchForecast("date")}>
            Get 15-Day Forecast
          </button>

          {forecastData && forecastData.datewise_level && (
            <div>
              <h3>15-Day Forecasts from {forecastData.selected_date}</h3>
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
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TimeSimulation;
