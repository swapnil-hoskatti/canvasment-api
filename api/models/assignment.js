const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    dueDate: Date,
    course: String,
    points: Number
});

module.exports = mongoose.model('Assignment', assignmentSchema);