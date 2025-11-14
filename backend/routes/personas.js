const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const Quest = require('../models/Quests')
const authMiddleware = require('../middleware/auth');
const { generatePersona, generatePersonalizedQuests } = require('../services/aiServices');

// POST /api/personas (CREATE a new persona)
router.post('/', authMiddleware, async (req, res) => {
    try {
        //Extract data from request body
        const { traits, fears, inspirations} = req.body;
        
        // Validate required fields
        if (!traits || !fears || !inspirations) {
            return res.status(400).json({ message: 'Please provide traits, fears, and inspirations' });
        }

        // Validate arrays are not empty
        if (traits.length === 0 || fears.length === 0 || inspirations.length === 0) {
            return res.status(400).json({ message: 'Traits, fears, and inspirations cannot be empty' });
        }

        // Check if user already has a persona
        const existingPersona = await Persona.findOne({ userId: req.userId });
        if (existingPersona) {
            return res.status(400).json({ message: 'Persona already exists for this user' });
        }

        // Generate AI description
        console.log('Calling AI service to generate persona description...');
        let aiGeneratedDescription;

        try {
            aiGeneratedDescription = await generatePersona(traits, fears, inspirations);
            console.log('AI-generated description received.');
        } catch (e) {
            console.error('AI service error:', e.message);

            return res.status(500).json({ message: 'Error generating persona description via AI service',
            error: e.message
        });
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

        // Generate first batch of quests immediately!
        console.log('Generating initial batch of quests...');
        let initialQuests = [];
        try {
            initialQuests = await generatePersonalizedQuests(savedPersona, 1);
            await Quest.insertMany(initialQuests);
            console.log(`Generated ${initialQuests.length} quests for Batch 1`);
        } catch (questError) {
            console.error('Quest generation failed:', questError.message);
            // User can still use the app, just won't have quests yet
        }

        res.status(201).json({
            message: 'Persona created successfully! Your first 3 quests are ready.',
            persona: savedPersona,
            questsGenerated: initialQuests.length
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

// DELETE /api/personas/me (DELETE current user's persona)
router.delete('/me', authMiddleware, async (req, res) => {
    try {
        const persona = await Persona.findOneAndDelete({ userId: req.userId });

        if (!persona) {
            return res.status(404).json({message: 'Persona not found'});
        }

        res.status(200).json({ message: 'Persona deleted successfully!'});
    } catch (e) {
        console.error('Error deleting persona:', e);
        res.status(500).json({ message: 'Server error while deleting persona'});
    }
});

// PUT /api/personas/me (UPDATE current user's persona)
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { traits, fears, inspirations, regenerateAI } = req.body;

        const persona = await Persona.findOne({ userId: req.userId });

        if (!persona) {
            return res.status(404).json({ message: 'Persona not found' });
        }

        if (traits) persona.traits = traits;
        if (fears) persona.fears = fears;
        if (inspirations) persona.inspirations = inspirations;

        if (regenerateAI === true) {
            console.log('Regenerating AI description...');
            try {
                const newDescription = await generatePersona(
                    persona.traits, 
                    persona.fears, 
                    persona.inspirations
                );
                persona.aiGeneratedDescription = newDescription;
                console.log('AI regeneration successful!');
            } catch (aiError) {
                console.error('AI regeneration failed:', aiError.message);
            }
        }

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