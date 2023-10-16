const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  course: { type: String, required: true },
  points: { type: Number, required: true },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
