// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navigation = () => {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const isLoggedIn = !!localStorage.getItem("token");

//   const handleLayout = () => {
//     const confirmLayout = window.confirm("Are you sure you want to logout");
//     if (confirmLayout) {
//       localStorage.removeItem("token");
//       navigate("/");
//     }
//   };

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <div className='logo'>
//       <div className='image_logo' style={{ margin: "20px" }}>
//         <img
//           style={{ width: "60px", height: "60px" }}
//           src='https://static.vecteezy.com/system/resources/thumbnails/009/337/383/small_2x/donate-and-charity-flat-color-icon-helping-hand-money-png.png'
//           alt='Logo'
//         />
//       </div>

//       <div className='hamburger' onClick={toggleMenu}>
//         ☰
//       </div>

//       <nav className={`main-nav ${isMenuOpen ? "active" : ""}`}>
//         <ul>
//           <li>
//             <Link to='/home'>💰Home</Link>
//           </li>
//           {/* <li>
//             <Link to='/summaryData'>💰 Donation Amount</Link>
//           </li>
//           <li>
//             <Link to='/donations'>📝 Donation List</Link>
//           </li>
//           <li>
//             <Link to='/trend'>📈 Trend Chart</Link>
//           </li> */}
//           <li>
//             <Link to='/summary'>📝 OverView</Link>
//           </li>
//           {isLoggedIn && (
//             <li>
//               <button onClick={handleLayout} className='logout-btn'>
//                 Logout
//               </button>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Navigation;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLayout = () => {
    toast.info(
      <div style={{ textAlign: "center" }}>
        <p>⚠️ Do you want to logout?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              toast.dismiss(); // close toast
              navigate("/");
            }}
          >
            Yes
          </button>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#5bc0de",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className='logo'>
      <div className='image_logo' style={{ margin: "20px" }}>
        <img
          style={{ width: "60px", height: "60px" }}
          src='https://static.vecteezy.com/system/resources/thumbnails/009/337/383/small_2x/donate-and-charity-flat-color-icon-helping-hand-money-png.png'
          alt='Logo'
        />
      </div>

      <div className='hamburger' onClick={toggleMenu}>
        ☰
      </div>

      <nav className={`main-nav ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link to='/home'>💰Home</Link>
          </li>
          <li>
            <Link to='/summary'>📝 OverView</Link>
          </li>
          {isLoggedIn && (
            <li>
              <button onClick={handleLayout} className='logout-btn'>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
