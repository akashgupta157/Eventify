const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
