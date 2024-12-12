import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const YearlyForecastPage = () => {
  const { year } = useParams(); // Get year from URL params
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
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
        setGraphData(data.graph); // Graph image in base64 format
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [year]);

  return (
    <div>
      <h1>Monthly Forecast for {year}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {graphData && <img src={graphData} alt="Yearly Forecast Graph" />}
    </div>
  );
};

export default YearlyForecastPage;
