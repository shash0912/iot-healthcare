import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ✅ Imports
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

        {/* 🏠 HOME */}
        <Route path="/" element={<Home />} />

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 📊 DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 📡 OTHER PAGES */}
        <Route path="/monitor" element={<PatientMonitoring />} />
        <Route path="/alerts" element={<AlertHistory />} />
        <Route path="/logs" element={<BlockchainLogs />} />
        <Route path="/history" element={<PatientHistory />} />

        {/* ❌ FALLBACK (VERY IMPORTANT) */}
        <Route path="*" element={<Navigate to="/" />} />

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