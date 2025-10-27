import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DonationForm from "./DonationForm";
import "./App.css";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

const Home = () => {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });

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
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, []);

  const handleDonationUpdate = () => {
    // Optional: refresh donation stats if needed
  };

  return (
    <>
      <div>
        <Navigation />
        <div style={{ marginTop: "50px" }} className='dashboard'>
          <div className='donation-section'>
            <h2 className='section-title'>Make a Difference Today 💖</h2>

            <div className='donation-content'>
              <div className='message-left'>
                <p className='small_msg'>
                  “One small donation from you can rewrite someone’s future.” 🙏
                </p>
                <p className='para'>
                  🙏 Support a Cause, Make a Change... Help us reach the target
                  and transform more lives. Your donation helps us create
                  meaningful impact, whether it's by supporting education,
                  healthcare, sustainability, or community welfare. We believe
                  in transparency, purpose, and progress. Together, let's build
                  a better future. Please donate and be the reason someone
                  smiles today. 💫
                </p>
              </div>

              {/* ❌ Removed summary-right block */}
            </div>
          </div>

          <DonationForm onDonate={handleDonationUpdate} />
        </div>
        <ChatBot />
        <Footer />
      </div>
    </>
  );
};

export default Home;
