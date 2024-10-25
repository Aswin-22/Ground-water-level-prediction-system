// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="header navbar">
      <div className="logo">Logo</div>
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
