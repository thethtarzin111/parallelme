const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('=== DEBUG INFO ===');
console.log('dotenv.parsed.MONGO_URI:', dotenv.parsed?.MONGO_URI);
console.log('process.env.MONGO_URI:', process.env.MONGO_URI);
console.log('Are they the same?', dotenv.parsed?.MONGO_URI === process.env.MONGO_URI);
console.log('==================');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

//DEBUG: Check allowed origins
console.log('Allowed CORS origins:', allowedOrigins);

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',  // ⚠️ NOT recommended for production, but works for testing
  credentials: true
}));
/*
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
*/
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

mongoose.connect(process.env.MONGO_URI) 
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Connection string:', process.env.MONGO_URI);
    });


// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'ParallelMe API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});