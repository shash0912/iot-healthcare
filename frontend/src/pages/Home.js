import { Link } from "react-router-dom";
import Navbar from "../Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f172a, #2563eb)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "40px" }}>
          Blockchain Based IoMT Healthcare System
        </h1>

        <p style={{ maxWidth: "600px", margin: "20px" }}>
          Secure, real-time patient monitoring using IoMT devices and blockchain
          technology for transparency and data integrity.
        </p>

        <div>
          <Link to="/login">
            <button style={{ margin: "10px", padding: "10px 20px" }}>
              Login
            </button>
          </Link>

          <Link to="/dashboard">
            <button style={{ margin: "10px", padding: "10px 20px" }}>
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;