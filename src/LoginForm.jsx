import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const userAgent = navigator.userAgent;
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear previous errors
    setUsernameError("");
    setPasswordError("");

    if (!username) setUsernameError("Username required");
    if (!password) setPasswordError("Password required");
    if (!username || !password) return;

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("user_agent", userAgent);

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
      navigate("/home");
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || "Login Failed";

      if (errorMsg.toLowerCase().includes("password")) {
        setPasswordError(errorMsg);
      } else {
        setUsernameError(errorMsg);
      }
    }
  };

  return (
    <>
      <div className='container'>
        <div className='boxed_container'>
          <div className='boxed_container_1'>
            <h2 className='welcome'>WELCOME</h2>
            <h3 className='headline'>To Your Donation</h3>
            <p className='description'>
              Manage all your donations in one place. Track donors, monitor
              campaigns, and view monthly trends with ease. Your impact starts
              here!
            </p>
          </div>

          <div className='box_container'>
            <h3 className='signin'>LOGIN</h3>
            <p style={{ fontWeight: "500" }} className='tagline'>
              Login to access your donation dashboard and make real impact. View
              contributions, track donor trends, and manage campaigns with ease.
            </p>

            <input
              className='login-input'
              type='text'
              placeholder='Username'
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError("");
              }}
              value={username}
              required
            />
            {usernameError && <p className='field-error'>{usernameError}</p>}

            <input
              className='login-input'
              type='password'
              placeholder='Password'
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              value={password}
              required
            />
            {passwordError && <p className='field-error'>{passwordError}</p>}

            {/* <div className='flex-row'>
              <a href='#' className='forgot'>
                Forgot Password?
              </a>
            </div> */}

            <button className='login-btn' onClick={handleLogin}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
