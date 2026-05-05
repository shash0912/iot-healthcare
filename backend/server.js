const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

mongoose.connection.once("open", () => {
  console.log("🔥 DB Ready");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
  });
});

/* =========================
   Schemas
========================= */

const PatientSchema = new mongoose.Schema({
  patientId: String,
  heartRate: Number,
  temperature: Number,
  spo2: Number,
  bp: String,
  status: String,
  timestamp: String
});

const AlertSchema = new mongoose.Schema({
  patientId: String,
  reason: String,
  heartRate: Number,
  temperature: Number,
  spo2: Number,
  timestamp: String
});

const BlockSchema = new mongoose.Schema({
  index: Number,
  data: Object,
  previousHash: String,
  hash: String,
  timestamp: String
});

const Patient = mongoose.model("Patient", PatientSchema);
const Alert = mongoose.model("Alert", AlertSchema);
const Block = mongoose.model("Block", BlockSchema);

/* =========================
   Login API
========================= */

const users = [
  { username: "admin", password: "admin123" },
  { username: "doctor", password: "doc123" }
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  res.json({ success: !!user });
});

/* =========================
   Hash Function
========================= */

function createHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

/* =========================
   Generate Smart Data
========================= */

async function generateData() {
  const ids = ["P001", "P002", "P003", "P004", "P005"];
  const results = [];

  for (let id of ids) {
    const heartRate = Math.floor(Math.random() * 40) + 60;
    const temperature = +(36 + Math.random() * 2).toFixed(1);
    const spo2 = Math.floor(Math.random() * 5) + 94;
    const bp = `${110 + (Math.random()*20 | 0)}/${70 + (Math.random()*10 | 0)}`;

    const status =
      heartRate > 100 || temperature > 37.5 || spo2 < 95
        ? "CRITICAL"
        : "NORMAL";

    const timestamp = new Date().toLocaleString();

    const record = {
      patientId: id,
      heartRate,
      temperature,
      spo2,
      bp,
      status,
      timestamp
    };

    // Get last record of this patient
    const lastRecord = await Patient.findOne({ patientId: id })
      .sort({ _id: -1 });

    // Save patient record
    await Patient.create(record);

    // 🚨 ALERT ONLY IF STATUS CHANGED
    if (!lastRecord || lastRecord.status !== status) {
      if (status === "CRITICAL") {
        await Alert.create({
          patientId: id,
          reason: "Vitals crossed safe threshold",
          heartRate,
          temperature,
          spo2,
          timestamp
        });
      }
    }

    // 🔗 Blockchain
    const lastBlock = await Block.findOne().sort({ index: -1 });

    const newBlock = {
      index: lastBlock ? lastBlock.index + 1 : 1,
      data: record,
      previousHash: lastBlock ? lastBlock.hash : "0",
      timestamp
    };

    newBlock.hash = createHash(newBlock);
    await Block.create(newBlock);

    results.push(record);
  }

  return results;
}

/* =========================
   APIs
========================= */

// Live patients
app.get("/patients", async (req, res) => {
  try {
    const data = await generateData();
    res.json(data);
  } catch (err) {
    console.error("PATIENT ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// History
app.get("/history", async (req, res) => {
  try {
    const data = await Patient.find().sort({ _id: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Alerts
app.get("/alerts", async (req, res) => {
  try {
    const data = await Alert.find().sort({ _id: -1 }).limit(20);
    res.json(data);
  } catch (err) {
    console.error("ALERT ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Blockchain logs
app.get("/blocks", async (req, res) => {
  try {
    const blocks = await Block.find().sort({ index: -1 }).limit(20);
    res.json(blocks);
  } catch (err) {
    console.error("BLOCK ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Root
app.get("/", (req, res) => {
  res.send("Backend running with smart alerts");
});