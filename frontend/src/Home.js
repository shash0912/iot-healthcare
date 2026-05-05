import { Link } from "react-router-dom";
import PageWrapper from "../PageWrapper";

function Home() {
  return (
    <PageWrapper>
      <div className="login-bg" style={{ flexDirection: "column", color: "white" }}>
        <h1>Blockchain IoMT Healthcare System</h1>
        <p>Secure monitoring using blockchain</p>

        <div>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/dashboard"><button>Dashboard</button></Link>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;