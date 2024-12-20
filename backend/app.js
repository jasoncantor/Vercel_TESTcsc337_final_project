/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
The main route to connect the backend to the frontend
Routes the information to our server
*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors({
  origin: 'https://cantor-oneill-sullivan-csc337-final.vercel.app',
  credentials: true,
}));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const budgetRoutes = require('./routes/budgets');
const specialTaskRoutes = require('./routes/specialTasks');
const equipmentRoutes = require('./routes/equipment');
const messageRoutes = require('./routes/messages');

app.use(userRoutes);
app.use(taskRoutes);
app.use(budgetRoutes);
app.use(specialTaskRoutes);
app.use(equipmentRoutes);
app.use(messageRoutes);

// Serve help page
app.get('/help', (req, res) => {
  res.sendFile(__dirname + '/frontend/help.html');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
