
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/task', async (req, res) => {
  const { area, activity, notes, assignedTo } = req.body;
  try {
    const task = new Task({ area, activity, notes, assignedTo });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/task/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
