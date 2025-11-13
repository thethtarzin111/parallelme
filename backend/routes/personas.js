const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const authMiddleware = require('../middleware/auth');

// POST /api/personas (CREATE a new persona)
router.post('/', authMiddleware, async (req, res) => {
    try {
        //Extract data from request body
        const { traits, fears, inspirations, aiGeneratedDescription} = req.body;
        
        // Validate required fields
        if (!traits || !fears || !inspirations) {
            return res.status(400).json({ message: 'Please provide traits, fears, and inspirations' });
        }

        // Check if user already has a persona
        const existingPersona = await Persona.findOne({ userId: req.userId });
        if (existingPersona) {
            return res.status(400).json({ message: 'Persona already exists for this user' });
        }

        // Create new persona
        const newPersona = new Persona({
            userId: req.userId,
            traits,
            fears,
            inspirations,
            aiGeneratedDescription: aiGeneratedDescription
        });

        // Save to database
        const savedPersona = await newPersona.save();

        res.status(201).json({
            message: 'Persona created successfully',
            persona: savedPersona
        });
    } catch (error) {
        console.error('Error creating persona:', error);
        res.status(500).json({ message: 'Server error while creating persona' });
    }
});

// GET /api/personas/me (GET current user's persona)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Find persona by userId
        const persona = await Persona.findOne({ userId: req.userId });

        if (!persona) {
            return res.status(404).json({ message: 'Persona not found for this user' });
        }

        res.status(200).json({
            message: 'Persona retrieved successfully',
            persona
        });
    } catch (error) {
        console.error('Error retrieving persona:', error);
        res.status(500).json({ message: 'Server error while retrieving persona' });
    }
});

// PUT /api/personas/me (UPDATE current user's persona)
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { id } = req.user;
        const { traits, fears, inspirations, aiGeneratedDescription } = req.body;

        // Find the persona by userId
        const persona = await Persona.findOne({ userId: req.userId });

        if (!persona) {
            return res.status(404).json({ message: 'Persona not found' });
        }

        // Check if this persona belongs to the authenticated user
        if (persona.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this persona' });
        }

        // Update fields if provided
        if (traits) persona.traits = traits;
        if (fears) persona.fears = fears;
        if (inspirations) persona.inspirations = inspirations;
        if (aiGeneratedDescription) persona.aiGeneratedDescription = aiGeneratedDescription;

        // Save updated persona
        const updatedPersona = await persona.save();

        res.status(200).json({
            message: 'Persona updated successfully',
            persona: updatedPersona
        });
    } catch (error) {
        console.error('Error updating persona:', error);
        return res.status(500).json({ message: 'Server error while updating persona' });
    }
});

module.exports = router;