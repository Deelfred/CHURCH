const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Activity = require("../models/Activity");

// HELPER: Log activity and emit notification
const logActivity = async (req, action, entityId, entityName, previousData, newData) => {
  try {
    const changes = {};
    if (previousData && newData) {
      Object.keys(newData).forEach((key) => {
        if (previousData[key] !== newData[key]) {
          changes[key] = {
            from: previousData[key],
            to: newData[key],
          };
        }
      });
    }

    const activity = new Activity({
      action,
      entityType: "MEMBER",
      entityId,
      entityName,
      changes,
      previousData: previousData || {},
      newData: newData || {},
      description: `Member "${entityName}" was ${action.toLowerCase()}ed`,
      timestamp: new Date(),
    });

    await activity.save();

    // Emit notification to admin
    const io = req.app.get("io");
    if (io) {
      io.emit("member-activity", {
        action,
        entityName,
        description: activity.description,
        timestamp: new Date(),
        activity,
      });
    }
  } catch (err) {
    console.log("ACTIVITY LOG ERROR:", err);
  }
};

// ➕ ADD MEMBER
router.post("/", async (req, res) => {
  try {
    const member = await Member.create(req.body);

    // Log activity
    await logActivity(
      req,
      "ADD",
      member._id,
      member.name,
      null,
      member.toObject()
    );

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 📋 GET ALL MEMBERS (FIXED FORMAT)
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ✏️ UPDATE MEMBER
router.put("/:id", async (req, res) => {
  try {
    const previousMember = await Member.findById(req.params.id);

    if (!previousMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity
    await logActivity(
      req,
      "UPDATE",
      member._id,
      member.name,
      previousMember.toObject(),
      member.toObject()
    );

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 🗑️ DELETE MEMBER
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Log activity
    await logActivity(
      req,
      "DELETE",
      member._id,
      member.name,
      member.toObject(),
      null
    );

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;