const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/golf-course', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors({
  origin: 'http://127.0.0.1:5500', 
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
