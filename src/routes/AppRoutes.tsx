import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Otp from "../pages/Otp";
import Signup from "../pages/Signup";
import Home from "../pages/Home";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/otp" element={<Otp />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Home />} />
  </Routes>
);

export default AppRoutes;
