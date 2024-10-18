import React, { useState } from "react";
import axios from "axios";

function Form() {
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
    <div>
      <h1>Groundwater Level Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          District:
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Station:
          <input
            type="text"
            name="station"
            value={formData.station}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Year:
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Month:
          <input
            type="number"
            name="month"
            value={formData.month}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {loading && <p>Loading prediction...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {prediction !== null && (
        <div>
          <h2>Predicted Groundwater Level: {prediction}</h2>
        </div>
      )}
    </div>
  );
}

export default Form;
