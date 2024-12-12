import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DatewiseForecastPage = () => {
  const { selectedDate } = useParams(); // Get selected date from URL params
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make sure the correct URL is being hit
        const response = await fetch("http://localhost:5000/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selected_date: selectedDate }),  // Ensure the correct data format
        });

        if (!response.ok) throw new Error("Failed to fetch forecast data");

        const data = await response.json();
        setGraphData(data.graph); // Graph image in base64 format
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [selectedDate]);

  return (
    <div>
      <h1>Datewise Forecast for {selectedDate}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {graphData && (
        <div>
          <h3>Level Forecast</h3>
          <img src={graphData} alt="Level Forecast" />
          <h3>Storage Forecast</h3>
          <img src={graphData} alt="Storage Forecast" />
        </div>
      )}
    </div>
  );
};

export default DatewiseForecastPage;
