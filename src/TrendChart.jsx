import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Footer from "./Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrendChart({ selectedMonth }) {
  const [trendData, setTrendData] = useState([]);
  const isSingleMonth = !!selectedMonth;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const query = selectedMonth
      ? `months=${selectedMonth}`
      : ["2025-06", "2025-07", "2025-08", "2025-09"]
          .map((m) => `months=${m}`)
          .join("&");

    fetch(`http://localhost:8004/trend?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrendData(data));
  }, [selectedMonth]);

  const chartData = {
    labels: trendData.map((d) => d.label), 
    datasets: [
      {
        label: isSingleMonth ? "Daily Donations" : "Monthly Donations",
        data: trendData.map((d) => d.amount),
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#FFC0CB",
        pointBorderColor: "#333",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: isSingleMonth
          ? `📅 Daily Donation Trend for ${selectedMonth}`
          : "📈 Monthly Donation Trend",
      },
    },
    scales: {
      x: {
        grid: {
          color: "#141414",
          lineWidth: 1,
          borderDash: [5, 5],
        },
        ticks: {
          color: "#007bff",
          font: { size: 14, weight: "bold" },
        },
        title: {
          display: true,
          text: isSingleMonth ? "Date" : "Month",
          color: "#333",
          font: { size: 20, weight: "bold" },
          padding: { top: 10, bottom: 0 },
        },
      },
      y: {
        grid: {
          color: "#141414",
          lineWidth: 1,
        },
        ticks: {
          color: "navy",
          font: { size: 14, weight: "bold" },
          callback: (value) => `₹${value}`,
        },
        title: {
          display: true,
          text: "Amount (₹)",
          color: "#333",
          font: { size: 16, weight: "bold" },
          padding: { top: 0, bottom: 10 },
        },
      },
    },
  };

  return (
    <div className='trend-chart-container'>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendChart;
