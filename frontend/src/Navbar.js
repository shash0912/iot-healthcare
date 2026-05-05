import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="sidebar">
      <h2>🏥 IoMT Care</h2>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/monitor">Monitoring</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/logs">Blockchain</Link>
      <Link to="/history">History</Link>
    </div>
  );
}

export default Navbar;