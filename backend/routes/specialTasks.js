
const express = require('express');
const router = express.Router();
const SpecialTask = require('../models/SpecialTask');

router.post('/special-task', async (req, res) => {
  const { name, targetArea, notes } = req.body;
  try {
    const specialTask = new SpecialTask({ name, targetArea, notes });
    await specialTask.save();
    res.status(201).json(specialTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/special-tasks', async (req, res) => {
  try {
    const specialTasks = await SpecialTask.find();
    res.status(200).json(specialTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
