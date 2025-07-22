import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Home from "./Home";
import SummaryPage from "./SummaryPage";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/home' element={<Home />} />
        <Route path='/summary' element={<SummaryPage />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
