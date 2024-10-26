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
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
  ]);
  const [data, setData] = useState([30, 40, 70, 80, 10, 70, 80, 10, 90, 80]);

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const newLabels = graphData.map(item => item.year);
      const newData = graphData.map(item => item.prediction);
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
        label: "Groundwater Level",
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
