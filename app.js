const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const app = express();
const initializeDBConnection = require('./db/db');  // Renamed for clarity
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/Transaction.routes');  // Renamed for consistency

// Initialize database connection
initializeDBConnection();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route (for testing purposes)
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Use user-related routes
app.use('/user', userRoutes);

// Use transaction-related routes
app.use('/transactions', transactionRoutes);  // Changed '/' to '/transactions' for better route clarity

module.exports = app;
