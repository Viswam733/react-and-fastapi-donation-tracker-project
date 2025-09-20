import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DonationForm from "./DonationForm";
import "./App.css";
import Navigation from "./Navigation";
import Footer from "./Footer";
import Summary from "./Summary"; // ✨ If you're displaying it here
import ChatBot from "./ChatBot";
const Home = () => {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });

  const [summaryData, setSummaryData] = useState(null);
  const [globalSummary, setGlobalSummary] = useState(null);

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
        } else {
          // 🔁 Monthly summary
          axios
            .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSummaryData(res.data.summary));

          axios
            .get("http://localhost:8004/summary", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setGlobalSummary(res.data));
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [selectedMonth]);

  const handleDonationUpdate = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummaryData(res.data.summary));

    axios
      .get("http://localhost:8004/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGlobalSummary(res.data));
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
                  smiles today. We’ve raised ₹35,000 so far towards our ₹50,000
                  goal! Help us reach the target and transform more lives. Your
                  contribution goes directly to causes like education,
                  healthcare, and community support. 💫
                </p>
              </div>

              <div className='summary-right'>
                {globalSummary && (
                  <Summary
                    period='Total Donations (All Months)'
                    summaryData={globalSummary}
                  />
                )}
              </div>
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
