import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>🏥 Smart IoMT Healthcare System</h1>

        <p>
          Real-time ICU monitoring powered by IoMT, secured with blockchain,
          and enhanced with intelligent alert systems.
        </p>
      </motion.div>

      {/* STATS */}
      <div className="stats">
        {["5+", "24/7", "100%"].map((val, i) => (
          <motion.div
            key={i}
            className="stat glass"
            whileHover={{ scale: 1.1 }}
          >
            <h2>{val}</h2>
            <p>
              {i === 0 && "Patients"}
              {i === 1 && "Monitoring"}
              {i === 2 && "Secure"}
            </p>
          </motion.div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="features">
        {[
          ["📡 Real-Time Monitoring", "Track vitals instantly"],
          ["🔴 Smart Alerts", "Detect abnormal conditions"],
          ["🔗 Blockchain Security", "Tamper-proof medical records"],
          ["📊 Data Visualization", "Interactive charts & analytics"]
        ].map((f, i) => (
          <motion.div
            key={i}
            className="feature-card glass"
            whileHover={{ scale: 1.05 }}
          >
            <h3>{f[0]}</h3>
            <p>{f[1]}</p>
          </motion.div>
        ))}
      </div>

      {/* WORKFLOW */}
      <motion.div
        className="workflow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>System Flow</h2>

        <div className="flow">
          <span>📡 IoMT Devices</span>
          <span>→</span>
          <span>⚙️ Controller</span>
          <span>→</span>
          <span>🗄 MongoDB</span>
          <span>→</span>
          <span>🔗 Blockchain</span>
          <span>→</span>
          <span>📊 Dashboard</span>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="cta"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Ready to Experience Smart Healthcare?</h2>

        {/* ✅ FIXED BUTTON */}
        <button
          className="btn primary"
          onClick={() => navigate("/login")}
        >
          🚀 Login Now
        </button>
      </motion.div>

    </div>
  );
}

export default Home;