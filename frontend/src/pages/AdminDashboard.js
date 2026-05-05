import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function Dashboard() {
  const user = localStorage.getItem("user");

  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // 🔁 Load data
  useEffect(() => {
    const load = () => {
      fetch("https://iot-healthcare-dihz.onrender.com/patients")
      .then(res => res.json())
      .then(setPatients);

      fetch("https://iot-healthcare-dihz.onrender.com/alerts")
      .then(res => res.json())
      .then(setAlerts);

      fetch("https://iot-healthcare-dihz.onrender.com/blocks")
      .then(res => res.json())
      .then(setBlocks);
    };

    load();
    const t = setInterval(load, 4000); // auto-refresh

    return () => clearInterval(t);
  }, []);

  // 📊 Derived stats
  const totalPatients = patients.length;
  const criticalCount = patients.filter(p => p.status === "CRITICAL").length;
  const alertCount = alerts.length;
  const blockCount = blocks.length;

  return (
    <div className="app">
      <Navbar />

      <div className="main">
        {/* Header */}
        <div className="header-bar">
          <div className="patient-name">Welcome, Dr. {user}</div>
          <div>🟢 System Online</div>
        </div>

        {/* KPI CARDS */}
        <div className="grid">
          <div className="card">
            <h4>Total Patients</h4>
            <h2>{totalPatients}</h2>
          </div>

          <div className="card">
            <h4>Critical Cases</h4>
            <h2 style={{ color: "red" }}>{criticalCount}</h2>
          </div>

          <div className="card">
            <h4>Active Alerts</h4>
            <h2>{alertCount}</h2>
          </div>

          <div className="card">
            <h4>Blockchain Blocks</h4>
            <h2>{blockCount}</h2>
          </div>
        </div>

        {/* LIVE ACTIVITY */}
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Live Activity</h3>

          {patients.length === 0 ? (
            <p>Loading...</p>
          ) : (
            patients.map(p => (
              <p
                key={p.patientId}
                className={p.status === "CRITICAL" ? "critical" : "normal"}
              >
                {p.patientId} → {p.status} (HR: {p.heartRate}, SpO2: {p.spo2})
              </p>
            ))
          )}
        </div>

        {/* RECENT ALERTS */}
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Recent Alerts</h3>

          {alerts.length === 0 ? (
            <p>No alerts</p>
          ) : (
            alerts.slice(0, 5).map(a => (
              <p key={a._id} style={{ color: "red" }}>
                🚨 {a.patientId} → {a.reason}
              </p>
            ))
          )}
        </div>

        {/* RECENT BLOCKS */}
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Blockchain Activity</h3>

          {blocks.length === 0 ? (
            <p>No blocks</p>
          ) : (
            blocks.slice(0, 5).map(b => (
              <p key={b.index}>
                Block #{b.index} → {b.hash.substring(0, 12)}...
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;