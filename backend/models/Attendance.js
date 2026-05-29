const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    service: {
      type: String,
      default: "Sunday Service",
    },

    // 🕒 when user checked in
    time: {
      type: Date,
      default: Date.now,
    },

    // 🔄 SESSION SYSTEM (NEW)
    sessionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);