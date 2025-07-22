import React, { useState, useEffect } from "react";
import "./App.css";
const DonationList = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8004/donations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched donations:", data);
        setDonations(data);
      })
      .catch((err) => {
        console.error("Error fetching donations:", err);
      });
  }, []);

  return (
    <div className='donations-list'>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Donation List
      </h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
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
    </div>
  );
};

export default DonationList;
