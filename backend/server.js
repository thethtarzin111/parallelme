const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://parallelme.vercel.app'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: 'Too many requests from this IP, please try again later.'
});

// Import routes
const authRoutes = require('./routes/auth');
const personaRoutes = require('./routes/personas');
const questRoutes = require('./routes/quests');
const storyRoutes = require('./routes/stories');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/quests',questRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/', limiter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'ParallelMe API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});