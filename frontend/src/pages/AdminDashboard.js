import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import PageWrapper from "../PageWrapper";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  // 📡 AUTO REFRESH
  useEffect(() => {
    const fetchData = () => {
      fetch("https://iot-healthcare-dihz.onrender.com/patients")
        .then(res => res.json())
        .then(setPatients);

      fetch("https://iot-healthcare-dihz.onrender.com/history")
        .then(res => res.json())
        .then(setHistory);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔴 SOUND ALERT
  useEffect(() => {
    if (patients.some(p => p.status === "CRITICAL")) {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
      audio.play();
    }
  }, [patients]);

  // 🔍 FILTER
  const filtered = patients.filter(p =>
    p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="app">
        <Navbar />

        <div className="main">

          {/* HEADER */}
          <div className="header">
            <h2>🏥 ICU Smart Dashboard</h2>
            <p>👤 {localStorage.getItem("user")}</p>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search Patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />

          {/* KPI CARDS */}
          <div className="card-grid">
            <div className="card blue">
              <h3>Total</h3>
              <p>{patients.length}</p>
            </div>

            <div className="card green">
              <h3>Normal</h3>
              <p>{patients.filter(p => p.status === "NORMAL").length}</p>
            </div>

            <div className="card red">
              <h3>Critical</h3>
              <p>{patients.filter(p => p.status === "CRITICAL").length}</p>
            </div>
          </div>

          {/* PATIENT CARDS */}
          <div className="card">
            <h3>Live Patients</h3>
            <div className="grid">
              {filtered.map((p, i) => (
                <div
                  key={i}
                  className={`patient-card ${p.status === "CRITICAL" ? "critical" : ""}`}
                >
                  <h4>{p.patientId}</h4>
                  <p>❤️ {p.heartRate}</p>
                  <p>🌡 {p.temperature}</p>
                  <p>🫁 {p.spo2}</p>
                  <p>🩺 {p.bp}</p>
                  <span className={p.status}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE CHART */}
          <div className="card">
            <h3>Live Vitals</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="patientId" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" />
                <Line type="monotone" dataKey="spo2" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* HISTORY CHART */}
          <div className="card">
            <h3>History Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" />
                <Line type="monotone" dataKey="temperature" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;