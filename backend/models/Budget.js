/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Model for a given users budget 
Contains all of the fields that a user can input
*/
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

module.exports = mongoose.model('Budget', BudgetSchema);
