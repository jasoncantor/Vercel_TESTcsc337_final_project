
const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.post('/equipment', async (req, res) => {
  const { name, status, quantity, notes } = req.body;
  try {
    const equipment = new Equipment({ name, status, quantity, notes });
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/equipment', async (req, res) => {
  try {
    const equipmentList = await Equipment.find();
    res.status(200).json(equipmentList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/equipment/:id', async (req, res) => {
  const { id } = req.params;
  const { status, quantity, notes } = req.body;
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      { status, quantity, notes },
      { new: true }
    );
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
