const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["ADD", "UPDATE", "DELETE"],
      required: true,
    },

    entityType: {
      type: String,
      enum: ["MEMBER", "ATTENDANCE"],
      required: true,
    },

    entityId: {
      type: String,
      required: true,
    },

    entityName: {
      type: String,
      required: true,
    },

    changes: {
      type: Object,
      default: {},
    },

    previousData: {
      type: Object,
      default: {},
    },

    newData: {
      type: Object,
      default: {},
    },

    description: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
