import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-section'>
          <h4>About This Project</h4>
          <p>
            A platform to promote transparent donations and social good, built
            with ❤️ by VISWAM.
          </p>
        </div>

        <div className='footer-section'>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href='/overview'>Overview</a>
            </li>
            <li>
              <a href='/donations'>Donation List</a>
            </li>
            <li>
              <a href='/charts'>Trends</a>
            </li>
            <li>
              <a href='/logout'>Logout</a>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4>Contact</h4>
          <p>Email: support@donateimpact.in</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        <div className='footer-section'>
          <h4>Acknowledgement</h4>
          <p>Made with React ⚛️ + FastAPI 🚀.</p>
          <p>Thanks to all contributors & supporters!</p>
        </div>

        <div className='footer-section'>
          <h4>Follow Us</h4>
          <div className='social-icons'>
            <a href='https://facebook.com' target='_blank' rel='noreferrer'>
              <FaFacebook />
            </a>
            <a href='https://twitter.com' target='_blank' rel='noreferrer'>
              <FaTwitter />
            </a>
            <a href='https://instagram.com' target='_blank' rel='noreferrer'>
              <FaInstagram />
            </a>
            <a href='https://linkedin.com' target='_blank' rel='noreferrer'>
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© {new Date().getFullYear()} Crafted by VISWAM with ☕ + 💻</p>
      </div>
    </footer>
  );
};

export default Footer;
