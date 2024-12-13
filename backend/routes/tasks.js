/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Route to obtain a given users task list from the database
Allow for obtaining, deleting, creating, and editing the tasks
*/
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/api/tasks', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const tasks = await Task.find({ username });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
});

// Create a new task
router.post('/api/task', async (req, res) => {
  const { activity, area, notes, assignedTo, username } = req.body;

  if (!activity || !area || !username) {
    return res.status(400).json({ message: 'Activity, Area, and Username are required.' });
  }

  try {
    const newTask = new Task({
      activity,
      area,
      notes,
      assignedTo,
      username,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating task.' });
  }
});

// Update a task
router.put('/api/task/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, username, activity, area, assignedTo, notes } = req.body;

  if (completed === undefined && (!activity || !area || !username)) {
    return res.status(400).json({ message: 'Completed status or Activity, Area, and Username are required.' });
  }

  try {
    const task = await Task.findOne({ _id: id, username });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (completed !== undefined) {
      task.completed = completed;
    }
    if (activity) {
      task.activity = activity;
    }
    if (area) {
      task.area = area;
    }
    if (assignedTo) {
      task.assignedTo = assignedTo;
    }
    if (notes) {
      task.notes = notes;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating task.' });
  }
});

// Delete a task 
router.delete('/api/task/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: id, username });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting task.' });
  }
});

module.exports = router;
