import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const DonationForm = ({}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    address: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:8004/donate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert("Thank you so much for donation");
        setFormData({
          name: "",
          email: "",
          phone: "",
          amount: "",
          address: "",
          date: "",
        });
      })
      .catch((err) => {
        console.error("Donation Failed", err);
      });
  };
  return (
    <form onSubmit={handleSubmit} className='donation-form'>
      <div className='left_panel'>
        <div>
          <input
            name='name'
            placeholder='Name'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name='email'
            placeholder='Email'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name='phone'
            placeholder='Phone'
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='right_panel'>
        <div>
          {" "}
          <input
            name='amount'
            placeholder='Amount'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name='address'
            placeholder='Address'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {" "}
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>
      <button className='button_donate' type='submit'>
        Donate
      </button>
    </form>
  );
};

export default DonationForm;
