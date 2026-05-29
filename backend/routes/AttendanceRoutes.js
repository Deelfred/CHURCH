const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// =======================
// 🔥 CHECK-IN (UPDATED)
// =======================
router.post("/check-in", async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      sessionId: req.sessionId, // 👈 from server.js middleware
    });

    await attendance.save();

    res.json({
      success: true,
      message: "Attendance saved",
      sessionId: req.sessionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// 📊 GET ATTENDANCE
// =======================
router.get("/attendance", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;