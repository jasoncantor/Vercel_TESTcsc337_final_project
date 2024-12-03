
const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: String,
  status: String, 
  quantity: Number,
  notes: String,
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
