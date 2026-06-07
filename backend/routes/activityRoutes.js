const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// ➕ CREATE ACTIVITY LOG
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      message: "Activity logged successfully",
      data: activity,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 📋 GET ALL ACTIVITIES
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 🔍 GET ACTIVITIES BY TYPE
router.get("/type/:type", async (req, res) => {
  try {
    const activities = await Activity.find({
      entityType: req.params.type,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 🔍 GET ACTIVITIES BY ACTION
router.get("/action/:action", async (req, res) => {
  try {
    const activities = await Activity.find({
      action: req.params.action,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
