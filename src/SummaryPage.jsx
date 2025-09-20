import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Summary from "./Summary";
import DonationList from "./DonationList";
import TrendChart from "./TrendChart";
import DonationExport from "./DonationExport";

function SummaryPage() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const selectedMonthReadable = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "All Months Combined";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const endpoint = selectedMonth
        ? `http://localhost:8004/dashboard?month=${selectedMonth}`
        : `http://localhost:8004/dashboard`;

      axios
        .get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data?.summary;
          if (data && typeof data === "object") {
            setSummaryData(data);
          } else {
            setSummaryData(null); // fallback if summary is missing
          }
        });
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [selectedMonth]);

  return (
    <div className='summary-page'>
      <div style={{ marginBottom: "20px" }}>
        <label className='viewSummary' style={{ marginRight: "150px" }}>
          Choose Month:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "8px" }}
        >
          <option value=''>All Months</option>
          <option value='2025-06'>June 2025</option>
          <option value='2025-07'>July 2025</option>
          <option value='2025-08'>August 2025</option>
          <option value='2025-09'>September 2025</option>
          <option value='2025-10'>October 2025</option>
          <option value='2025-11'>November 2025</option>
          <option value='2025-12'>December 2025</option>
        </select>
        <div className='export'>
          <DonationExport />
        </div>
      </div>

      <Summary period={selectedMonthReadable} summaryData={summaryData} />
      <DonationList selectedMonth={selectedMonth} />
      <TrendChart selectedMonth={selectedMonth} />
    </div>
  );
}

export default SummaryPage;
