import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

function GraphForm({ setGraphData }) {
  const [locations, setLocations] = useState([{ lat: "", lon: "" }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddLocation = () => {
    if (locations.length < 10) {
      setLocations([...locations, { lat: "", lon: "" }]);
    }
  };

  const handleChange = (index, e) => {
    const newLocations = [...locations];
    newLocations[index][e.target.name] = e.target.value;
    setLocations(newLocations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const allPredictions = await Promise.all(
        locations.map(async (location) => {
          const response = await axios.post("http://localhost:5000/predict", {
            lat: location.lat,
            lon: location.lon,
          });
          return {
            lat: location.lat,
            lon: location.lon,
            prediction: response.data.prediction.value,
          };
        })
      );

      setGraphData(allPredictions);
    } catch (error) {
      console.error("Error fetching graph data:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {locations.map((location, index) => (
          <div className="form-group" key={index}>
            <label>Location {index + 1}:</label>
            <input
              type="number"
              name="lat"
              placeholder="Latitude"
              value={location.lat}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="number"
              name="lon"
              placeholder="Longitude"
              value={location.lon}
              onChange={(e) => handleChange(index, e)}
              required
            />
          </div>
        ))}
        <div className="button-section">
          <button
            type="button"
            onClick={handleAddLocation}
            disabled={locations.length >= 10}
          >
            Add Location
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Generate Graph"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </form>
    </div>
  );
}

export default GraphForm;
