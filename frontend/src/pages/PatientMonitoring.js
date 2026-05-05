import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function Monitoring() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/patients")
        .then(res => res.json())
        .then(setPatients);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <Navbar />

      <div className="main">
        <div className="header-bar">
          <div className="patient-name">Patient Monitoring</div>
        </div>

        <div className="grid">
          {patients.map(p => (
            <div key={p.patientId} className="card">
              <h3>{p.patientId}</h3>
              <p>❤️ Heart Rate: {p.heartRate}</p>
              <p>🌡 Temp: {p.temperature}</p>
              <p>🫁 SpO2: {p.spo2}</p>
              <p>🩺 BP: {p.bp}</p>
              <p className={p.status === "CRITICAL" ? "critical" : "normal"}>
                {p.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Monitoring;