import React, { useState, useEffect } from "react";
import Footer from "./Footer";

const DonationList = ({ selectedMonth }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const endpoint = selectedMonth
      ? `http://localhost:8004/donations?month=${selectedMonth}`
      : `http://localhost:8004/donations`;

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Fetched donations:", data);
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          setDonations([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching donations:", err);
        setDonations([]);
      })
      .finally(() => setLoading(false));
  }, [selectedMonth]);

  return (
    <div className='donations-list'>
      <h1 style={{ textAlign: "center", color: "white", marginBottom: "10px" }}>
        Donations for {selectedMonth || "All Months"}
      </h1>

      <div
        style={{
          maxHeight: "700px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            ⏳ Loading donations...
          </p>
        ) : donations.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            ⚠️ No donations found for this period.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{ position: "sticky", top: 0, backgroundColor: "#f5f5f5" }}
            >
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={donation.id || `${donation.name}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{donation.name}</td>
                  <td>₹{donation.amount}</td>
                  <td>{donation.email}</td>
                  <td>{donation.phone}</td>
                  <td>{donation.address}</td>
                  <td>{donation.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonationList;
