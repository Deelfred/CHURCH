const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },

    gender: {
      type: String,
      default: "Not set",
    },

    department: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);