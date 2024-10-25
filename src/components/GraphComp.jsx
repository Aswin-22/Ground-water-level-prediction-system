import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function GraphComp({ graphData }) {
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

  const defaultData = {
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    datasets: [
      {
        label: "Groundwater Level",
        data: [30, 40, 70, 80, 10],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "#1e293b",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
    className="graph-box"
      style={{
        height: "100vh", // Fixed height
        width: "100vw",
        margin: "0 auto",
        color: "white",
        backgroundColor: "#1e293b",
        padding: "20px",
        paddingTop: "120px",
        paddingRight: "400px",
        borderRadius: "8px",
      }}
    >
      {graphData ? (
        <Bar data={graphData} options={options} />
      ) : (
        <Bar data={defaultData} options={options} />
      )}
    </div>
  );
}

export default GraphComp;
