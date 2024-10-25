import React, { useState } from "react";
import axios from "axios";

function GraphForm({ setGraphData }) {
  const [formData, setFormData] = useState({
    location: "",
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
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData
      );
      setGraphData(response.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
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
            min={formData.startYear}
            max={parseInt(formData.startYear) + 10}
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
