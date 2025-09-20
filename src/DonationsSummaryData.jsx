import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const DonationsSummaryWrapper = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        return;
      }

      axios
        .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSummaryData(res.data.summary));
    } catch (err) {
      localStorage.removeItem("token");
    }
  }, [selectedMonth]);

  return <Summary period={selectedMonth} summaryData={summaryData} />;
};

export default DonationsSummaryWrapper;
