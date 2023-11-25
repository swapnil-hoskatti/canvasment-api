const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  assignId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateTime: { type: Date, required: true },
  enabled: { type: Boolean, required: true },
});

module.exports = mongoose.model("Notification", notificationSchema);
