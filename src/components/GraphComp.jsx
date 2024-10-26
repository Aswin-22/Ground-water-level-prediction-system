import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function GraphComp({ graphData }) {
  const [labels, setLabels] = useState([
    "year 1",
    "year 2",
    "year 3",
    "year 4",
    "year 5",
  ]);
  const [data, setData] = useState([30, 40, 80, 87, 56]);

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const newLabels = graphData.map(
        (item, index) =>
          `Location ${index + 1} (Lat: ${item.lat}, Lon: ${item.lon})`
      );
      const newData = graphData.map((item) => item.prediction);
      setLabels(newLabels);
      setData(newData);
    }
  }, [graphData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: { color: "#ffffff" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#ffffff" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
  };

  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: "Groundwater Level Predictions",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "#1e293b",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        color: "white",
        backgroundColor: "#1e293b",
        padding: "20px",
        paddingTop: "120px",
        paddingRight: "400px",
        borderRadius: "8px",
      }}
    >
      <Bar data={formattedData} options={options} />
    </div>
  );
}

export default GraphComp;
