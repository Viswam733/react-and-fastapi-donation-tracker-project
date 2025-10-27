import React from "react";

function Summary({ period, summaryData }) {
  if (
    !summaryData ||
    typeof summaryData.total_donors !== "number" ||
    typeof summaryData.total_amount !== "number" ||
    typeof summaryData.total_campaigns !== "number"
  ) {
    return (
      <p style={{ color: "white", marginTop: "20px" }}>
        ⚠️ No summary data available for {period}.
      </p>
    );
  }

  return (
    <div className='summary' style={{ marginTop: "30px" }}>
      <div className='donation' style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>
          🗓️ {period}
        </p>
      </div>
      <div
        className='boxes'
        style={{ display: "flex", gap: "20px", justifyContent: "center" }}
      >
        <div className='boxed' style={boxStyle}>
          👥 Total Donors: {summaryData.total_donors}
        </div>
        <div className='boxed' style={boxStyle}>
          💰 Total Donated: ₹{summaryData.total_amount.toLocaleString("en-IN")}
        </div>
        <div className='boxed' style={boxStyle}>
          🎯 Campaigns: {summaryData.total_campaigns}
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  backgroundColor: "#FFD700",
  padding: "20px",
  borderRadius: "50%",
  fontWeight: "bold",
  fontSize: "18px",
  color: "#333",
  textAlign: "center",
  minWidth: "180px",
};

export default Summary;
