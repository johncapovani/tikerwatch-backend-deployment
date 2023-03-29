// Import the required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Bring in errorHandler
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Stock Analysis Routes
const stockRoutes = require('./routes/stockRoutes');
app.use('/api/stocks', stockRoutes);

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Set the app to use our errorHandler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
