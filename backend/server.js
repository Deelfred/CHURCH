const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// 🔄 SESSION SYSTEM
// =========================

let currentSessionId = Date.now().toString();
let lastActivityTime = Date.now();

// ⏱ check every minute for inactivity
setInterval(() => {
  const now = Date.now();

  // 1 hour = 3600000ms
  const oneHour = 3600000;

  if (now - lastActivityTime > oneHour) {
    currentSessionId = Date.now().toString();
    console.log("🔄 New session started:", currentSessionId);
  }
}, 60000);

// Make session available globally
app.use((req, res, next) => {
  req.sessionId = currentSessionId;
  next();
});

// =========================
// ROUTES
// =========================
app.use("/api", attendanceRoutes);

// =========================
// DATABASE
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("Server Running");
});

// =========================
// START SERVER
// =========================
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server started on port 5000");
});