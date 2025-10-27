import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import Home from "./Home";
import SummaryPage from "./SummaryPage";
import DashboardLayout from "./DashboardLayout";
import DonationForm from "./DonationForm";
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

        <Route path='/donate' element={<DonationForm />} />
      </Routes>

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
