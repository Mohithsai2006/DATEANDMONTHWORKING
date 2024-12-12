import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TimeSimulation = () => {
  const [isMonthlyStorage, setIsMonthlyStorage] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();  // Hook to navigate to different routes

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const navigateToForecastPage = (type) => {
    if (type === "year") {
      navigate(`/yearly-forecast/${selectedYear}`);
    } else {
      navigate(`/datewise-forecast/${selectedDate}`);
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
          <button onClick={() => navigateToForecastPage("year")}>
            Go to Monthly Forecast
          </button>
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
          <button onClick={() => navigateToForecastPage("date")}>
            Go to 15-Day Forecast
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSimulation;
