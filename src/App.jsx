import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage"; // Assuming you have a HomePage component
import MapPage from "./components/MapPage";
import GraphPage from "./components/GraphPage";
import Navbar from "./components/Navbar"; // Navbar for navigation

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/graph" element={<GraphPage />} />
        {/* Redirect any unmatched route to homepage */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
