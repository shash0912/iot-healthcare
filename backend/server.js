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
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
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
   Generate Patient Data
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

    // 🔍 Get last record of this patient
    const lastRecord = await Patient.findOne({ patientId: id })
      .sort({ _id: -1 });

    // 🔍 Build current reasons
    let reasons = [];
    if (heartRate > 100) reasons.push("High Heart Rate");
    if (temperature > 37.5) reasons.push("High Temperature");
    if (spo2 < 95) reasons.push("Low SpO2");

    const newReason = reasons.join(", ");

    let shouldCreateAlert = false;

    if (reasons.length > 0) {
      if (!lastRecord) {
        // first time critical
        shouldCreateAlert = true;
      } else {
        // check last alert
        const lastAlert = await Alert.findOne({ patientId: id })
          .sort({ _id: -1 });

        if (!lastAlert) {
          shouldCreateAlert = true;
        } else {
          // 🔥 compare reason
          if (lastAlert.reason !== newReason) {
            shouldCreateAlert = true;
          }
        }
      }
    }

    // Save patient record
    await Patient.create(record);

    // Create alert only if NEW condition
    if (shouldCreateAlert) {
      await Alert.create({
        patientId: id,
        reason: newReason,
        heartRate,
        temperature,
        spo2,
        timestamp
      });
    }

    // Blockchain block
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

app.get("/patients", async (req, res) => {
  const data = await generateData();
  res.json(data);
});

app.get("/history", async (req, res) => {
  const data = await Patient.find().sort({ _id: -1 }).limit(50);
  res.json(data);
});

app.get("/alerts", async (req, res) => {
  const data = await Alert.find().sort({ _id: -1 }).limit(20);
  res.json(data);
});

app.get("/blocks", async (req, res) => {
  const blocks = await Block.find().sort({ index: -1 }).limit(20);
  res.json(blocks);
});

app.get("/", (req, res) => {
  res.send("Backend running with smart alerts");
});

/* =========================
   Start Server
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});