/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
Route to obtain a given users information from the database
Allow for creating and logging in as a user.
*/
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User login 
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find the user
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// User logout
router.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// User registration
router.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Create a new user
    user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
});

module.exports = router;
