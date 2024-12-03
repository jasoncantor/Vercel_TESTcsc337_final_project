
const mongoose = require('mongoose');

const SpecialTaskSchema = new mongoose.Schema({
  name: String,
  applicationDate: { type: Date, default: Date.now },
  targetArea: String,
  notes: String,
});

module.exports = mongoose.model('SpecialTask', SpecialTaskSchema);
