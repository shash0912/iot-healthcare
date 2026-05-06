import { Link, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/monitor", label: "📡 Monitoring" },
    { path: "/alerts", label: "🚨 Alerts" },
    { path: "/logs", label: "🔗 Blockchain" },
    { path: "/history", label: "📜 History" }
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">🏥 IoMT Care</h2>

      <div className="nav-links">
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navbar;