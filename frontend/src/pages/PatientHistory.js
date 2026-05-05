import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import PageWrapper from "../PageWrapper";

function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(setHistory);
  }, []);

  return (
    <PageWrapper>
      <div className="app">
        <Navbar />
        <div className="main">
          <div className="header">History</div>

          <div className="card">
            {history.map((h, i) => (
              <p key={i}>
                {h.patientId} - {h.heartRate} bpm - {h.status}
              </p>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default PatientHistory;