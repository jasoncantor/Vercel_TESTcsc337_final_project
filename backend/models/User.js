/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Model for the creation of a user
Contains all of the fields that are required to make a user
*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
