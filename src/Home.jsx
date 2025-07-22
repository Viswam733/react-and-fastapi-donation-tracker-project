import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DonationForm from "./DonationForm";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });

  const [summaryData, setSummaryData] = useState(null);

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
          axios
            .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("Backend response:", res.data);
              setSummaryData(res.data.summary);
            })
            .catch((err) => {
              console.log("Token rejected by backend", err);
              localStorage.removeItem("token");
              navigate("/");
            });
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [selectedMonth]);

  return (
    <>
      <div>
        <nav className='main-nav'>
          <ul>
            <li>
              <Link to='/donations'>📝 Donation List</Link>
            </li>
            <li>
              <Link to='/amount'>💰 Donation Amount</Link>
            </li>
            <li>
              <Link to='/trend'>📈 Trend Chart</Link>
            </li>
          </ul>
        </nav>

        <div className='dashboard'>
          <DonationForm
            onDonate={() => {
              const token = localStorage.getItem("token");
              axios
                .get(`http://localhost:8004/dashboard?month=${selectedMonth}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => setSummaryData(res.data.summary));
            }}
          />
          <Link className='viewSummary' to='/summary'>
            📊 View Summary
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
