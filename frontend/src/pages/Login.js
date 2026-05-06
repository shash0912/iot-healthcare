import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
const res = await fetch("https://iot-healthcare-dihz.onrender.com/login", {  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ username, password })
});

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", username);

        // smooth redirect delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);

      } else {
        alert("Invalid credentials");
      }

    } catch (err) {
      alert("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h1>Blockchain Based Muilprotocol IoMT Controller</h1>
        <h2>🏥 Smart Hospital System</h2>
        <p style={{fontSize:"12px", marginBottom:"15px"}}>
          Secure IoMT Patient Monitoring Login
        </p>

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

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{fontSize:"11px", marginTop:"10px", color:"gray"}}>
          Demo: admin / admin123
        </p>

      </div>
    </div>
  );
}

export default Login;