// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginForm from "./LoginForm";
// import Home from "./Home";
// import SummaryPage from "./SummaryPage";
// import "./App.css";
// import Summary from "./Summary";
// import DonationsSummaryWrapper from "./DonationsSummaryData";
// import DashboardLayout from "./DashboardLayout";
// import DonationList from "./DonationList";
// import TrendChart from "./TrendChart";
// import Footer from "./Footer";
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/' element={<LoginForm />} />
//         <Route path='/home' element={<Home />} />
//         <Route
//           path='/summary'
//           element={
//             <DashboardLayout>
//               <SummaryPage />
//             </DashboardLayout>
//           }
//         />{" "}
//         <Route
//           path='/summaryData'
//           element={
//             <DashboardLayout>
//               <DonationsSummaryWrapper />
//             </DashboardLayout>
//           }
//         />
//         <Route
//           path='/donations'
//           element={
//             <DashboardLayout>
//               <DonationList />{" "}
//             </DashboardLayout>
//           }
//         />{" "}
//         <Route
//           path='/trend'
//           element={
//             <DashboardLayout>
//               <TrendChart />
//             </DashboardLayout>
//           }
//         />{" "}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "./LoginForm";
import Home from "./Home";
import SummaryPage from "./SummaryPage"; // or DonationsSummaryWrapper
import DashboardLayout from "./DashboardLayout";
import DonationForm from "./DonationForm"; // if needed
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/home' element={<Home />} />
        <Route
          path='/summary'
          element={
            <DashboardLayout>
              <SummaryPage />
            </DashboardLayout>
          }
        />
        {/* Optional route to test DonationForm directly */}
        <Route path='/donate' element={<DonationForm />} />
      </Routes>

      {/* Toast container globally available */}
      <ToastContainer
        position='top-center' // 👈 center of screen
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme='colored'
      />
    </BrowserRouter>
  );
}

export default App;
