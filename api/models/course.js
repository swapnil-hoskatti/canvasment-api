const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: String,
  courseCode: { type: String, required: true },
	instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	students: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
	assignments: { type: [mongoose.Schema.Types.ObjectId], ref: "Assignment" },
});

module.exports = mongoose.model("Course", courseSchema);