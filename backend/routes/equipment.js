/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Route to obtain a given users equipment from the database
Allow for obtaining, deleting, and creating an equipment list
*/
const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// Get all equipment 
router.get('/api/equipment', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const equipmentList = await Equipment.find({ username });
    res.json(equipmentList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching equipment.' });
  }
});

// Create a new equipment entry 
router.post('/api/equipment', async (req, res) => {
  const { name, status, quantity, notes, username } = req.body;

  if (!name || !status || !quantity || !username) {
    return res.status(400).json({ message: 'Name, Status, Quantity, and Username are required.' });
  }

  try {
    const newEquipment = new Equipment({
      name,
      status,
      quantity,
      notes,
      username,
    });
    await newEquipment.save();
    res.status(201).json(newEquipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating equipment entry.' });
  }
});

// Delete an equipment entry 
router.delete('/api/equipment/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const equipment = await Equipment.findOneAndDelete({ _id: id, username });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment entry not found.' });
    }

    res.json({ message: 'Equipment entry deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting equipment entry.' });
  }
});

module.exports = router;
