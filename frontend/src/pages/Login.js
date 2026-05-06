import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      // ❗ Check response
      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();

      // ❗ Extra safety check
      if (data && data.success) {
        localStorage.setItem("user", username);

        // slight delay for smoother UX
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);

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
    <div className="login-bg">
      <div className="login-card">

        <h1>🔗 Blockchain Based Multi-Protocol IoMT Controller</h1>
        <h2>🏥 Smart Hospital System</h2>

        <p style={{ fontSize: "12px", marginBottom: "15px" }}>
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

        <p style={{ fontSize: "11px", marginTop: "10px", color: "gray" }}>
          Demo: admin / admin123
        </p>

      </div>
    </div>
  );
}

export default Login;