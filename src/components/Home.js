import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [storageOption, setStorageOption] = useState("monthly"); // Default option

  const handleExploreClick = () => {
    navigate("/TimeSimulation", { state: { storageOption } }); // Pass the selected option
  };

  return (
    <div className="home">
      <div className="home-container first-page">
        <h1 className="welcome-title">Welcome to Our Website</h1>
        <p className="welcome-subtitle">Explore the future of water resource management with us.</p>
      </div>

      <div className="home-container second-page">
        <h2>Our Mission</h2>
        <p>Promoting sustainable water use and innovative technologies.</p>

        <button id="button" onClick={handleExploreClick}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default Home;
