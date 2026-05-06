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

  // 📡 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch("https://iot-healthcare-dihz.onrender.com/patients");
        const hRes = await fetch("https://iot-healthcare-dihz.onrender.com/history");

        const pData = await pRes.json();
        const hData = await hRes.json();

        setPatients(Array.isArray(pData) ? pData : []);
        setHistory(Array.isArray(hData) ? hData : []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setPatients([]);
        setHistory([]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔴 ALERT SOUND
  useEffect(() => {
    if (patients.some(p => p.status === "CRITICAL")) {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
      audio.play().catch(() => {});
    }
  }, [patients]);

  // 🔍 FILTER
  const filtered = patients.filter(p =>
    p.patientId?.toLowerCase().includes(search.toLowerCase())
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

          {/* KPI */}
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

          {/* PATIENTS */}
          <div className="card">
            <h3>Live Patients</h3>

            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>
                No patient data available
              </p>
            ) : (
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
            )}
          </div>

          {/* 🔥 ICU LIVE CHART */}
          <div className="card">
            <h3>Live Vitals</h3>

            {patients.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patients}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />

                  <XAxis dataKey="patientId" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "10px"
                    }}
                  />

                  {/* ❤️ HEART */}
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 8 }}
                    isAnimationActive
                    animationDuration={1000}
                  />

                  {/* 🫁 SPO2 */}
                  <Line
                    type="monotone"
                    dataKey="spo2"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    isAnimationActive
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 🔥 ICU HISTORY */}
          <div className="card">
            <h3>History Trend</h3>

            {history.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history.slice(0, 10)}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />

                  <XAxis dataKey="timestamp" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "10px"
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 7 }}
                    isAnimationActive
                    animationDuration={1200}
                  />

                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 7 }}
                    isAnimationActive
                    animationDuration={1400}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;