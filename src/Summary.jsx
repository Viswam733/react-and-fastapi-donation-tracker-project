import React from "react";
function Summary({ period, summaryData }) {
  if (!summaryData) return <p>Loading summary...</p>;

  const { total_donors, total_amount, total_campaigns } = summaryData;

  const formatAmount = (amt) => amt.toLocaleString("en-IN");

  return (
    <>
      <div className='summary'>
        <div
          style={{ marginRight: "1430px", marginTop: "30px" }}
          className='donation'
        >
          <p>🗓️ {period}</p>
        </div>
        <div className='boxes'>
          <div className='boxed'>Total Donors: {total_donors}</div>
          <div className='boxed'>
            Total Donated: ₹{formatAmount(total_amount)}
          </div>
          <div className='boxed'>Campaigns: {total_campaigns}</div>
        </div>
      </div>
    </>
  );
}

export default Summary;
