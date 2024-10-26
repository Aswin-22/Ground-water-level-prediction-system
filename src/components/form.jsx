import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the modal component
import "../styles.css"; // Import any necessary styles for the legend

function Form({ setUserLoc, setMapPosition }) {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    station: "",
    year: "",
    month: "",
  });

  const [indicator, setIndicator] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const apiKey = "pk.e56964b66a69241515576fd9bb159e02";

  const getCoordinates = async (state, district) => {
    const query = `Ambalapuzha, ${district}, ${state}`;
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        console.log("No results found for the specified location.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching the coordinates:", error);
      return null;
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLoc([latitude, longitude]); // Update App state
          setMapPosition([latitude, longitude]); // Move map to user's location
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Get predicted groundwater level
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData
      );
      const predictionValue = response.data.prediction;
      setPrediction(predictionValue);

      // Set indicator based on prediction
      let status, theme;
      if (predictionValue < 3) {
        status = "EXCESS";
        theme = "green";
      } else if (predictionValue < 15) {
        status = "NORMAL";
        theme = "blue";
      } else {
        status = "LOW";
        theme = "red";
      }

      setIndicator({ status, theme }); // Update indicator object

      // Get coordinates of the location
      const coords = await getCoordinates(formData.state, formData.district);
      if (coords) {
        setUserLoc([coords.lat, coords.lon]);
        setMapPosition([coords.lat, coords.lon]); // Fly to location on map
      }
      setIsModalOpen(true); // Open modal to show prediction
    } catch (error) {
      console.error("There was an error making the request!", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Legend data
  const legendData = [
    { status: "EXCESS", color: "rgba(0,255,0,0.5)", range: "< 3 Mbgl" },
    { status: "NORMAL", color: "rgba(0, 0, 255, 0.5)", range: "3 - 15 Mbgl" },
    { status: "LOW", color: "rgba(255, 0, 0, 0.5)", range: "> 15 Mbgl" },
  ];

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Station:</label>
          <input
            type="text"
            name="station"
            value={formData.station}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Month:</label>
          <input
            type="number"
            name="month"
            value={formData.month}
            onChange={handleChange}
            min={1}
            max={12}
          />
        </div>
        <div className="button-section">
          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
          <button type="button" onClick={handleGetLocation}>
            Use Your Location
          </button>
        </div>
      </form>

      {loading && <p>Loading prediction...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prediction={prediction}
        indicator={indicator}
      />

      
      <div className="legend-container">
        <div className="legend">
          <h3 style={{ color: "white" }}>Groundwater Level Indicators</h3>
          {legendData.map((item) => (
            <div
              key={item.status}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: item.color,
                  marginRight: "8px",
                }}
              />
              <span style={{ color: "white" }}>
                {item.status}: {item.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Form;
