import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import PageWrapper from "../PageWrapper";

function AlertHistory() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/alerts")
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  return (
    <PageWrapper>
      <div className="app">
        <Navbar />

        <div className="main">
          <div className="header">🚨 Alert History</div>

          <div className="grid">
            {alerts.length === 0 ? (
              <p>No alerts yet</p>
            ) : (
              alerts.map(a => (
                <div key={a._id} className="card">
                  <h3>{a.patientId}</h3>

                  <p style={{color:"red", fontWeight:"bold"}}>
                    {a.reason}
                  </p>

                  <p>
                    ❤️ {a.heartRate} bpm  
                    | 🌡 {a.temperature}°C  
                    | 🫁 {a.spo2}%
                  </p>

                  <small style={{color:"gray"}}>
                    {a.timestamp}
                  </small>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default AlertHistory;