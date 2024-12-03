
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

router.post('/budget', async (req, res) => {
  const { category, amount } = req.body;
  try {
    const budget = new Budget({ category, amount });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/budgets', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
