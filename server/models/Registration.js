const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: String,
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    eventTitle: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Joined", "Completed"],
      default: "Joined",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registrationSchema);