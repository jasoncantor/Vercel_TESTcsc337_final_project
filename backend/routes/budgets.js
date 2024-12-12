const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets 
router.get('/api/budgets', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const budgets = await Budget.find({ username });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching budgets.' });
  }
});

// Create a new budget entry 
router.post('/api/budget', async (req, res) => {
  const { category, amount, username } = req.body;

  if (!category || !amount || !username) {
    return res.status(400).json({ message: 'Category, Amount, and Username are required.' });
  }

  try {
    const newBudget = new Budget({
      category,
      amount,
      username,
    });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating budget entry.' });
  }
});

// Delete a budget entry 
router.delete('/api/budget/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const budget = await Budget.findOneAndDelete({ _id: id, username });
    if (!budget) {
      return res.status(404).json({ message: 'Budget entry not found.' });
    }

    res.json({ message: 'Budget entry deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting budget entry.' });
  }
});

module.exports = router;
