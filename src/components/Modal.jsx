import React from "react";
import "../styles.css"; // Import the CSS for the modal

const Modal = ({ isOpen, onClose, prediction, indicator }) => {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ color: "white" }}>Prediction Result</h2>
        <p>Predicted Groundwater Level: {prediction !== null ? prediction.value.toFixed(2) : "N/A"} Mbgl</p>
        <p>Condition is: {indicator.status || "N/A"}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
