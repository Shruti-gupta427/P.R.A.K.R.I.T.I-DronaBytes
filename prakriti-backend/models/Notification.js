const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "complaint_submitted",
        "complaint_assigned",
        "complaint_resolved",
       
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
