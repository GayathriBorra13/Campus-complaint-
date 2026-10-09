const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    attachments: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "Submitted",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Submitted",
    },

    adminResponse: {
      type: String,
      default: "",
    },

    resolutionAttachments: [
      {
        type: String,
      },
    ],

    history: [
      {
        status: String,
        message: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);