const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password } = req.body;

        // Basic validation - check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

        // Check password length 
        if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user
        const newUser = new User({ name, email, password });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });

    } catch (e) {
        console.error('Registeration error:', e);

        // Handle duplicate email error from MongoDB
        if (e.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Handle validation errors
        if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join('. ') });
        }

        // Generic server error
        res.status(500).json({message: 'Server error during registration. Please try again later.'});

    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password} = req.body;
        
        // Validate the input and check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password using the method from the User model
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });

        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ message: 'Server error during login. Please try again later.' });
    }
});


module.exports = router;
