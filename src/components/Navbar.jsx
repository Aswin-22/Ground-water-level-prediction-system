// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {location} from "./images/location.png"
import "../styles.css";

function Navbar() {
  return (
    <nav id="navigation">
      <div id="logo-container">
            <img src={"./images/location.png"} alt="" width="50" />
            <h1>HydroScope</h1>
        </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/graph">Graph</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
