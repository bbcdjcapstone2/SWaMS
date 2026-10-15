
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow the Vite frontend to send requests to this backend.
app.use(cors());
app.use(express.json());

// Create or open the local database file.
const dbPath = path.join(__dirname, "water_quality.db");
const db = new Database(dbPath);

// Create the table if it does not exist yet.
db.exec(`
  CREATE TABLE IF NOT EXISTS water_quality_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    turbidity REAL NOT NULL,
    temperature REAL NOT NULL,
    ph REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  );
`);

// Basic route to check if the backend is running.
app.get("/", (req, res) => {
  res.json({
    message: "SWaMS Water Quality Backend is running"
  });
});

// Receive a new sensor reading.
app.post("/api/readings", (req, res) => {
  const { turbidity, temperature, ph } = req.body;

  if (
    typeof turbidity !== "number" ||
    !Number.isFinite(turbidity) ||
    turbidity < 0 ||
    typeof temperature !== "number" ||
    !Number.isFinite(temperature) ||
    temperature < -50 ||
    temperature > 100 ||
    typeof ph !== "number" ||
    !Number.isFinite(ph) ||
    ph < 0 ||
    ph > 14
  ) {
    return res.status(400).json({
      error: "Invalid sensor readings. Check turbidity, temperature, and pH."
    });
  }

  const insert = db.prepare(`
    INSERT INTO water_quality_readings
      (turbidity, temperature, ph)
    VALUES (?, ?, ?)
  `);

  const result = insert.run(turbidity, temperature, ph);

  res.status(201).json({
    message: "Reading saved successfully",
    id: result.lastInsertRowid
  });
});

// Get the latest sensor reading.
app.get("/api/readings/latest", (req, res) => {
  const reading = db.prepare(`
    SELECT * FROM water_quality_readings
    ORDER BY id DESC
    LIMIT 1
  `).get();

  if (!reading) {
    return res.status(404).json({
      error: "No readings have been saved yet"
    });
  }

  res.json(reading);
});

// Get historical readings, newest first.
app.get("/api/readings", (req, res) => {
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 100, 1),
    1000
  );

  const readings = db.prepare(`
    SELECT * FROM water_quality_readings
    ORDER BY id DESC
    LIMIT ?
  `).all(limit);

  res.json(readings);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SWaMS backend running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
});
