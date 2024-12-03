
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Budget', BudgetSchema);
