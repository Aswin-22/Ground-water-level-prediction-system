// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import location from "../assets/location.png";
import "../homestyle.css";

function Navbar() {
  return (
    <nav id="header">
      <div id="logo-container">
        <img src={location} alt="" width="50" />
        <h1>HydroScope</h1>
      </div>
      <ul id="navigation">
        <li>
          <Link className="a" to="/">Home</Link>
        </li>
        <li>
          <Link className="a" to="/map">Map</Link>
        </li>
        <li>
          <Link className="a" to="/graph">Graph</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
