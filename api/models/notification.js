const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  assignId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateTime: { type: Date, required: true },
  enabled: { type: Boolean, required: true },
});

module.exports = mongoose.model("Notification", notificationSchema);
