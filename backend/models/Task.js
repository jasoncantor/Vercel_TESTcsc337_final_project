/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Model for a task that the user can create
Contains all of the fields that a user can input
*/
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  area: { type: String, required: true },
  assignedTo: { type: String },
  notes: { type: String },
  completed: { type: Boolean, default: false },
  username: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
