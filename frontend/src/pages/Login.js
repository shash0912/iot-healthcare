import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://iot-healthcare-dihz.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error("Server not responding");

      const data = await res.json();

      if (data && data.success) {
        localStorage.setItem("user", username);
        setTimeout(() => navigate("/dashboard"), 300);
      } else {
        alert("Invalid credentials");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error / Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1 className="login-title">🏥 IoMT Healthcare</h1>
        <p className="login-subtitle">
          Secure Blockchain-Based Patient Monitoring
        </p>

        <div className="input-group">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-btn"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-hint">
          Demo: admin / admin123
        </p>

      </div>

    </div>
  );
}

export default Login;