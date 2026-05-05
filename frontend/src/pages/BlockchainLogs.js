import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import PageWrapper from "../PageWrapper";

function BlockchainLogs() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/blocks")
      .then(res => res.json())
      .then(setBlocks);
  }, []);

  return (
    <PageWrapper>
      <div className="app">
        <Navbar />

        <div className="main">
          <div className="header">Blockchain Logs</div>

          <div className="card">
            {blocks.map(b => (
              <div key={b.index} style={{marginBottom:"15px"}}>
                <p><b>Block #{b.index}</b></p>
                <p>Hash: {b.hash}</p>
                <p style={{fontSize:"12px"}}>Prev: {b.previousHash}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default BlockchainLogs;