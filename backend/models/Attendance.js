const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    service: { type: String, default: "Sunday Service" },

    time: { type: Date, default: Date.now },

    // IMPORTANT: NOT REQUIRED
    sessionId: {
      type: String,
      default: "default-session",
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);