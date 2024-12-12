const mongoose = require('mongoose');

const SpecialTaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetArea: { type: String, required: true },
  notes: { type: String },
  applicationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

module.exports = mongoose.model('SpecialTask', SpecialTaskSchema);
