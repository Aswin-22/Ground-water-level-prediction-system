import React, { useState } from "react";
import axios from "axios";

function Form({ setUserLoc }) {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    station: "",
    year: "",
    month: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLoc([latitude, longitude]); // Update App state
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
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("There was an error making the request!", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <label>city</label>
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
            <button onClick={handleGetLocation}>Use Your Location</button>
          </div>
        </form>

        {loading && <p>Loading prediction...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {prediction !== null && (
          <div>
            <h2>Predicted Groundwater Level: {prediction.toFixed(2)} Mbgl</h2>
            <h6>*Mbgl - meters below ground level</h6>
          </div>
        )}
      </div>
    </>
  );
}

export default Form;

//Get user location and set location in app file so that it is accesible in map element
//app --> [ussserLocation, setUserLocation] state
//<form setUserLocation = {setUserLocation}>
//<map UserLocation = {UserLocation}>
// const handleGetLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation([latitude, longitude]);  // Update App state
//       },
//       (error) => {
//         console.error("Error getting location: ", error);
//       }
//     );
//   } else {
//     console.error("Geolocation is not supported by this browser.");
//   }
// };
