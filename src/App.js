import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TimeSimulation from "./components/TimeSimulation";
import YearlyForecastPage from "./components/YearlyForecastPage";
import DatewiseForecastPage from "./components/DatewiseForecastPage";
import About from "./components/About";
import Contact from "./components/Contact";
import Map from "./components/Map";
import AnalyticsPage from "./components/AnalyticsPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/map" element={<Map />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/TimeSimulation" element={<TimeSimulation />} />
        <Route path="/yearly-forecast/:year" element={<YearlyForecastPage />} />
        <Route path="/datewise-forecast/:selectedDate" element={<DatewiseForecastPage />} />
      </Routes>
    </Router>
  );
};

export default App;
