import React, { useEffect, useState } from "react";
import Summary from "./Summary";
import DonationList from "./DonationList";
import TrendChart from "./TrendChart";
import DonationExport from "./DonationExport";
import { useRefresh } from "./RefreshContext"; // ✅ Import context

function SummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refreshKey } = useRefresh(); // ✅ Use global refresh trigger

  const selectedMonthReadable = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "All Months";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoint = selectedMonth
      ? `http://localhost:8004/dashboard?month=${selectedMonth}`
      : `http://localhost:8004/dashboard`;

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Dashboard response:", data);
        setSummaryData(data?.summary || null);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setSummaryData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedMonth, refreshKey]); // ✅ Re-fetch when refreshKey changes

  return (
    <div className='summary-page'>
      <div style={{ marginBottom: "20px" }}>
        <label className='viewSummary' style={{ marginRight: "150px" }}>
          Choose Month:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setLoading(true);
          }}
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

      {loading ? (
        <p style={{ color: "white", marginTop: "20px" }}>
          ⏳ Loading summary...
        </p>
      ) : (
        <>
          <Summary period={selectedMonthReadable} summaryData={summaryData} />
          <DonationList selectedMonth={selectedMonth} key={refreshKey} />
          <TrendChart selectedMonth={selectedMonth} key={refreshKey} />
        </>
      )}
    </div>
  );
}

export default SummaryPage;
