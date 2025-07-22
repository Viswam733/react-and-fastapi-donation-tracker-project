import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const userAgent = navigator.userAgent;
  console.log(userAgent);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("user_agent", userAgent);
      console.log(formData.toString());
      const response = await axios.post(
        "http://127.0.0.1:8004/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
      setMessage("login success");
      navigate("/home");
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      setMessage("Login Failed");
    }
  };
  const handleLayout = () => {
    localStorage.removeItem("token");
    setMessage("logout");
    navigate("/");
  };
  const getDashboard = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8004/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.msg);
      console.log(res.data);
    } catch (err) {
      setMessage("Access Denied");
    }
  };

  return (
    <>
      <div className='container'>
        <div className='boxed_container_1'>
          <h2 className='welcome'>WELCOME</h2>
          <h3 className='headline'>To Your Donation</h3>
          <p className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className='box_container'>
          <h3 className='signin'>Login in</h3>
          <p className='tagline'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>

          <input
            className='login-input'
            type='text'
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            className='login-input'
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <div className='flex-row'>
            <label>
              <input type='checkbox' /> Remember me
            </label>
            <a href='#' className='forgot'>
              Forgot Password?
            </a>
          </div>

          <button className='login-btn' onClick={handleLogin}>
            Sign in
          </button>
          <p className='divider'>Or</p>
          <button className='alt-signin'>Sign in with other</button>

          <p className='signup-text'>
            Don't have an account?{" "}
            <a href='#' className='signup-link'>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
export default LoginForm;
