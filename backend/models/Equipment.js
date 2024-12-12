const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true }, 
  quantity: { type: Number, required: true },
  notes: { type: String },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
