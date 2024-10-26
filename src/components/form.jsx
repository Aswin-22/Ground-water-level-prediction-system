import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the modal component
import "../styles.css"; // Import any necessary styles for the legend

function Form({ setUserLoc, setMapPosition }) {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    city: "",
    lat: "",
    lon: "",
  });

  const [indicator, setIndicator] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch coordinates based on state, district, and city
  async function getCoordinates(state, district, city) {
    const apiKey = "pk.e56964b66a69241515576fd9bb159e02";
    const query = `${city}, ${district}, ${state}`;
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
        setFormData((prevData) => ({ ...prevData, lat, lon })); // Set lat/lon in formData
        setUserLoc([lat, lon]); // Update App state with user location
        setMapPosition([lat, lon]); // Move map to fetched location
      } else {
        console.log("No results found for the specified location.");
      }
    } catch (error) {
      console.error("Error fetching the coordinates:", error);
    }
  }

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

  const handleCoordinateFetch = async (e) => {
    e.preventDefault();
    const { state, district, city } = formData;
    if (state && district && city) {
      await getCoordinates(state, district, city);
    } else {
      alert("Please enter State, District, and City to fetch coordinates.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lon) {
      alert("Please fetch coordinates before submitting.");
      return;
    }

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
      setPrediction(predictionValue);

      const predict_float = parseFloat(predictionValue.value);

      // Set indicator based on prediction
      let status, theme;
      if (predict_float < 3) {
        status = "EXCESS";
        theme = "green";
      } else if (predict_float < 15) {
        status = "NORMAL";
        theme = "blue";
      } else {
        status = "LOW";
        theme = "red";
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
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" onClick={handleCoordinateFetch}>
          Fetch Coordinates
        </button>

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
