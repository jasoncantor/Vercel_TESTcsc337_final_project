
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  area: String,
  activity: String,
  date: { type: Date, default: Date.now },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);
