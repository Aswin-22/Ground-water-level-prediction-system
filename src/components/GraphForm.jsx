import React, { useState } from "react";
import axios from "axios";

function GraphForm({ setGraphData }) {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    station: "",
    startYear: "",
    endYear: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare to collect predictions for each year in the range
      const predictions = [];
      const startYear = Number(formData.startYear);
      const endYear = Number(formData.endYear);

      if (startYear > endYear) {
        throw new Error("Start Year must be less than or equal to End Year.");
      }

      for (let year = startYear; year <= endYear; year++) {
        const response = await axios.post("http://localhost:5000/predict", {
          state: formData.state,
          district: formData.district,
          station: formData.station,
          year: year,
          month: 1, // You can specify the month as needed
        });
        predictions.push({ year: year, prediction: response.data.prediction });
      }

      setGraphData(predictions);
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
          <label>City:</label>
          <input
            type="text"
            name="station"
            value={formData.station}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Start Year:</label>
          <input
            type="number"
            name="startYear"
            value={formData.startYear}
            onChange={handleChange}
            min="2000"
            max="2024"
          />
        </div>
        <div className="form-group">
          <label>End Year:</label>
          <input
            type="number"
            name="endYear"
            value={formData.endYear}
            onChange={handleChange}
            min="2000"
            max="2024"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Generate Graph"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </form>
    </div>
  );
}

export default GraphForm;
