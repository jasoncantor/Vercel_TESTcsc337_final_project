/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Route to obtain a given users special tasks from the database
Allow for obtaining, deleting, and creating special tasks
*/
const express = require('express');
const router = express.Router();
const SpecialTask = require('../models/SpecialTask');

// Get all special tasks 
router.get('/api/special-tasks', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const specialTasks = await SpecialTask.find({ username });
    res.json(specialTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching special tasks.' });
  }
});

// Create a new special task 
router.post('/api/special-task', async (req, res) => {
  const { name, targetArea, notes, username } = req.body;

  if (!name || !targetArea || !username) {
    return res.status(400).json({ message: 'Name, Target Area, and Username are required.' });
  }

  try {
    const newSpecialTask = new SpecialTask({
      name,
      targetArea,
      notes,
      username,
    });
    await newSpecialTask.save();
    res.status(201).json(newSpecialTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating special task.' });
  }
});

// Delete a special task 
router.delete('/api/special-task/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const specialTask = await SpecialTask.findOneAndDelete({ _id: id, username });
    if (!specialTask) {
      return res.status(404).json({ message: 'Special task not found.' });
    }

    res.json({ message: 'Special task deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting special task.' });
  }
});

module.exports = router;
