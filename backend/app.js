const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/golf-course', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const specialTaskRoutes = require('./routes/specialTasks');
const budgetRoutes = require('./routes/budgets');
const equipmentRoutes = require('./routes/equipment');

app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', specialTaskRoutes);
app.use('/api', budgetRoutes);
app.use('/api', equipmentRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});