const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send a message
router.post('/api/message', async (req, res) => {
  const { sender, receiver, content } = req.body;

  if (!sender || !receiver || !content) {
    return res.status(400).json({ message: 'Sender, Receiver, and Content are required.' });
  }

  try {
    const newMessage = new Message({
      sender,
      receiver,
      content,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
});

// Retrieve messages
router.get('/api/messages', async (req, res) => {
  const { sender, receiver } = req.query;

  if (!sender && !receiver) {
    return res.status(400).json({ message: 'Sender or Receiver is required.' });
  }

  try {
    const messages = await Message.find({
      $or: [{ sender }, { receiver }],
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while retrieving messages.' });
  }
});

// Delete a message
router.delete('/api/message/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting message.' });
  }
});

module.exports = router;
