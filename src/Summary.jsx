import React from "react";

function Summary({ period, summaryData }) {
  if (!summaryData) {
    return (
      <p style={{ color: "white", marginTop: "20px" }}>
        ⏳ Loading summary for {period}...
      </p>
    );
  }

  const { total_donors, total_amount, total_campaigns } = summaryData;
  const formatAmount = (amt) =>
    amt?.toLocaleString("en-IN", { minimumFractionDigits: 0 });

  return (
    <div className='summary' style={{ marginTop: "30px" }}>
      <div className='donation' style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>🗓️ {period}</p>
      </div>
      <div className='boxes' style={{ display: "flex", gap: "20px" }}>
        <div className='boxed'>👥 Total Donors: {total_donors}</div>
        <div className='boxed'>
          💰 Total Donated: ₹{formatAmount(total_amount)}
        </div>
        <div className='boxed'>📦 Campaigns: {total_campaigns}</div>
      </div>
    </div>
  );
}

export default Summary;
