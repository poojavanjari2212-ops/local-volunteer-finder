const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    volunteers: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String,
    },

    status: {
  type: String,
  default: "Active",
},


image:{
 type:String,
 required:false
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);