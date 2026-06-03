const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// =======================
// 🔥 CHECK-IN (REAL-TIME FIXED)
// =======================
router.post("/check-in", async (req, res) => {
  try {
    const io = req.app.get("io");

    const attendance = new Attendance({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || "",
      service: req.body.service || "Sunday Service",
      createdAt: new Date(),
    });

    await attendance.save();

    // ⚡ REAL-TIME UPDATE
    if (io) {
      io.emit("new-attendance", attendance);
    }

    res.json({
      success: true,
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (error) {
    console.log("CHECK-IN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// 📊 GET ALL ATTENDANCE
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

// =======================
// 📈 DAILY ANALYTICS
// =======================
router.get("/analytics/daily", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Attendance.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.json({ total: count.length });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// 📈 WEEKLY ANALYTICS
// =======================
router.get("/analytics/weekly", async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const count = await Attendance.find({
      createdAt: { $gte: weekAgo },
    });

    res.json({ total: count.length });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// 📈 MONTHLY ANALYTICS
// =======================
router.get("/analytics/monthly", async (req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await Attendance.find({
      createdAt: { $gte: startOfMonth },
    });

    res.json({ total: count.length });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;