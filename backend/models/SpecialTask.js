/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Model for the special tasks
Contains all of the fields that a user can input
*/
const mongoose = require('mongoose');

const SpecialTaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetArea: { type: String, required: true },
  notes: { type: String },
  applicationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

module.exports = mongoose.model('SpecialTask', SpecialTaskSchema);
