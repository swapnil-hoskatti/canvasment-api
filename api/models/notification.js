const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	dateTime: { type: Date, required: true },
});

module.exports = mongoose.model("Notification", notificationSchema);