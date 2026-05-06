import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ✅ move imports to top (only change)
import Login from "./pages/Login";
import Dashboard from "./pages/AdminDashboard";
import PatientMonitoring from "./pages/PatientMonitoring";
import BlockchainLogs from "./pages/BlockchainLogs";
import AlertHistory from "./pages/AlertHistory";
import PatientHistory from "./pages/PatientHistory";
import Home from "./pages/Home";



function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>

    {/* 🏠 HOME PAGE */}
    <Route path="/" element={<Home />} />

    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/monitor" element={<PatientMonitoring />} />
    <Route path="/alerts" element={<AlertHistory />} />
    <Route path="/logs" element={<BlockchainLogs />} />
    <Route path="/history" element={<PatientHistory />} />

  </Routes>
</AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}