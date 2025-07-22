import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Summary from "./Summary";
import DonationList from "./DonationList";
import TrendChart from "./TrendChart";
function SummaryPage() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          axios
            .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSummaryData(res.data.summary));
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [selectedMonth]);

  return (
    <div className='dashboard-wrapper'>
      <div style={{ marginTop: "50px" }}>
        <label className='viewSummary' style={{ marginRight: "10px" }}>
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
        </select>
      </div>
      <Summary period={selectedMonth} summaryData={summaryData} />
      <DonationList />
      <TrendChart />
    </div>
  );
}

export default SummaryPage;
