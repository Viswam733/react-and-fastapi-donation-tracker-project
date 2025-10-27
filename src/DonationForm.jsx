import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { toast } from "react-toastify";
import { useRefresh } from "./RefreshContext"; // ✅ Import context

const DonationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    address: "",
    date: "",
  });

  const { triggerRefresh } = useRefresh(); // ✅ Use global trigger

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "amount" ? parseInt(value) : value;
    setFormData({ ...formData, [name]: formattedValue });
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
        toast.success("🎉 Thank you for your donation!");
        handleReset();
        triggerRefresh(); // ✅ Notify SummaryPage to refresh
      })
      .catch((err) => {
        toast.error("❌ Donation failed. Please try again.");
      });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      amount: "",
      address: "",
      date: "",
    });
  };

  return (
    <div className='list_container'>
      <div className='down_arrow'>Please Donate Now ⬇️</div>

      <form onSubmit={handleSubmit} className='donation-form'>
        <div className='left_panel'>
          <input
            name='name'
            placeholder='Name'
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            name='email'
            placeholder='Email'
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            name='phone'
            placeholder='Phone'
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </div>

        <div className='right_panel'>
          <input
            type='number'
            name='amount'
            placeholder='Amount'
            onChange={handleChange}
            value={formData.amount}
            required
          />
          <input
            name='address'
            placeholder='Address'
            onChange={handleChange}
            value={formData.address}
            required
          />
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className='button_group'>
          <button className='button_donate' type='submit'>
            Donate
          </button>
        </div>

        <div className='reset_button_group'>
          <button className='button_reset' type='button' onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
