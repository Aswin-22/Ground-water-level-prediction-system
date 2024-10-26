import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the modal component
import "../styles.css"; // Import any necessary styles for the legend

function Form({ setUserLoc, setMapPosition }) {
  const [formData, setFormData] = useState({
    lat: "",
    lon: "",
  });

  const [indicator, setIndicator] = useState({});
  const [prediction, setPrediction] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLoc([latitude, longitude]); // Update App state
          setMapPosition([latitude, longitude]); // Move map to user's location
          setFormData({ lat: latitude, lon: longitude }); // Update form data
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
      // Send latitude and longitude to the Flask server for prediction
      const response = await axios.post("http://localhost:5000/predict", {
        lat: formData.lat,
        lon: formData.lon,
      });
      const predictionValue = response.data.prediction;
      setUserLoc([formData.lat, formData.lon])
      const predict_float = parseFloat(predictionValue.value)
      setPrediction(predict_float);


      // Set indicator based on prediction
      let status, theme;
      if (predict_float < 3) {
        status = "EXCESS";
        theme = "green";
      } else if (predict_float>5 & predict_float < 15) {
        status = "NORMAL";
        theme = "blue";
      } else if(predict_float >20) {
        status = "LOW";
        theme = "red";
      }else{
        status = "UNDEFINED";
      }

      setIndicator({ status, theme }); // Update indicator object
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
          <label>Latitude:</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="number"
            name="lon"
            value={formData.lon}
            onChange={handleChange}
            required
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

      {/* Choropleth Legend at the bottom center */}
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
