const express = require('express');
const router = express.Router();
const Quest = require('../models/Quests');
const Persona = require('../models/Persona');
const authMiddleware = require('../middleware/auth');
const { generatePersonalizedQuests } = require('../services/aiServices');

// GET /api/quests - Get all available and active quests for the current user
router.get('/', authMiddleware, async(req, res) => {
    try {
        // Find quests that are available or active at the moment (mustn't be locked or completed)
        const quests = await Quest.find({
            userId: req.userId,
            status: { $in: ['available', 'active']}
        }).sort({ batchNumber: 1, difficultyLevel: 1}); // Sort by batch and by difficulty level

        // Get current batch number 
        const currentBatch = quests.length > 0
        ? Math.max(...quests.map(q => q.batchNumber))
        : 0;

        res.status(200).json({
            message: 'Quests retrieved successfully',
            currentBatch,
            totalQuests: quests.length,
            quests
        });
    } catch (e) {
        console.error('Error fetching quests:', e);
        res.status(500).json({ message: 'Server error while fetching quests'});
    }
});

// POST /api/quests/:questId/start - Start a quest
router.post('/:questId/start', authMiddleware, async(req,res) => {
    try {
        const { questId } = req.params;

        // Find the quest
        const quest = await Quest.findById(questId);

        if (!quest) {
            return res.status(404).json({ message: 'Quest not found'});
        }

        // Verify this quest belongs to the user
        if (quest.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to start this quest'});
        }

        // Check if quest is available to start
        if (quest.status !== 'available') {
            return res.status(400).json({ message: `Cannot start quest. Current status: ${quest.status}`});
        }

        // Update status to active
        quest.status = 'active';
        await quest.save();

        res.status(200).json({ message: 'Quest started successfully! You got this!',quest});
    } catch (e) {
        console.error('Error starting quest:', e);
        res.status(500).json({ message: 'Server error while starting quest'});
    }
});

// PUT /api/quests/:questId/complete - Mark quest as complete with reflection
router.put('/:questId/complete', authMiddleware, async (req, res) => {
    
    // For debugging
    console.log('Received body:', req.body);
    console.log('Reflection value:', req.body.reflection);
    console.log('Reflection type:', typeof req.body.reflection);
    
    try {
        const { questId } = req.params;
        const { reflection } = req.body;

        // Validate reflection
        if (!reflection || reflection.trim().length === 0) {
            return res.status(400).json({ message: 'Reflection is required to complete a quest'});
        }

        if (reflection.lenth > 500) {
            return res.status(400).json({ message: 'Reflection must be less than or equal to 500 characters'});
        }

        // Find the quest
        const quest = await Quest.findById(questId);

        if (!quest) {
            return res.status(404).json({ message: 'Quest not found '});
        }

        // Verify this quest belongs to the user
        if (quest.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to complete this quest'});
        }

        // Check if quest is active
        if (quest.status !== 'active') {
            return res.status(400).json({ message:  `Cannot complete quest. Current status: ${quest.status}`});
        }

        // Mark as complete
        quest.status = 'completed';
        quest.reflection = reflection.trim();
        quest.completedAt = new Date();
        await quest.save();

        console.log(`Quest "${quest.title}" completed!`);

        // Check if the next batch should be unlocked
        const currentBatch = quest.batchNumber;

        // Get all quests in the current batch
        const batchQuests = await Quest.find({
            userId: req.userId,
            batchNumber: currentBatch
        });

        // Check if all quests in this batch are completed
        const allCompleted = batchQuests.every(q=> q.status === 'completed');

        let unlockedNewBatch = false;
        let newBatchNumber = null;

        if (allCompleted && currentBatch < 10 ) {
            console.log(`Batch ${currentBatch} complete! Unlocking Batch ${currentBatch + 1}...`);

            // Check if next batch already exists 
            const nextBatchExists = await Quest.findOne({
                userId: req.userId,
                batchNumber: currentBatch + 1
            });

            if (nextBatchExists) {
                // Just unlock existing quests
                await Quest.updateMany(
                    { userId: req.userId, batchNumber: currentBatch + 1},
                    { status: 'available', unlockedAt: new Date()}
                );
                console.log(`Batch ${currentBatch + 1} unlocked!`);
            } else {
                // Generate new batch with AI
                try {
                    const persona = await Persona.findOne({ userId: req.userId });
                    const newQuests = await generatePersonalizedQuests(persona, currentBatch + 1);
                    
                    // Insert the quests (they'll be 'locked' by default)
                    const insertedQuests = await Quest.insertMany(newQuests);
                    
                    // Immediately unlock them
                    await Quest.updateMany(
                        { 
                            _id: { $in: insertedQuests.map(q => q._id) }
                        },
                        { 
                            $set: {
                                status: 'available', 
                                unlockedAt: new Date() 
                            }
                        }
                    );
                    
                    console.log(`Generated and unlocked Batch ${currentBatch + 1}!`);
                } catch (e) {
                    console.error('Error generating next batch:', e);
                    // Don't fail the completion - quest is still marked complete
                }
            }

            unlockedNewBatch = true;
            newBatchNumber = currentBatch + 1;
        }

        res.status(200).json({ 
            message: allCompleted
                ? `🎉 Amazing! You completed Batch ${currentBatch}!${currentBatch < 10 ? ` Batch ${currentBatch + 1} is now unlocked!` : ' You finished all 30 quests! 🏆'}` 
                : `Great job completing "${quest.title}"! Keep going! 💪`,
            quest,
            pointsEarned: quest.points,
            batchCompleted: allCompleted,
            unlockedNewBatch,
            newBatchNumber
        });
    } catch (e) {
        console.error('Error completing quest:', e);
        res.status(500).json({ message: 'Server error while completing quest' });
    }
});

// GET /api/quests/completed - Get all completed quests for the current user
router.get('/completed', authMiddleware, async (req, res) => {
    try {
        const completedQuests = await Quest.find({
            userId: req.userId,
            status: 'completed'
        }).sort({ completedAt: -1 }); // Most recent first

        res.status(200).json({
            message: 'Completed quests retrieved successfully',
            totalCompleted: completedQuests.length,
            quests: completedQuests
        });
    } catch (e) {
        console.error('Error fetching completed quests:', e);
        res.status(500).json({ message: 'Server error while fetching completed quests'});
    }
});

// GET /api/quests/stats - Get quest statistics for the user
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const allQuests = await Quest.find({ userId: req.userId });

        const stats = {
            totalQuests: allQuests.length,
            completed: allQuests.filter(q => q.status === 'completed').length,
            active: allQuests.filter(q => q.status === 'active').length,
            available: allQuests.filter(q => q.status === 'available').length,
            locked: allQuests.filter(q => q.status === 'locked').length,
            currentBatch: Math.max(...allQuests.map(q => q.batchNumber), 0),
            totalPoints: allQuests.filter(q=> q.status === 'completed').reduce((sum , q) => sum + q.points, 0),
            completionRate: allQuests.length > 0
                ? Math.round((allQuests.filter(q => q.status === 'completed').length / allQuests.length) * 100)
                : 0
        };

        res.status(200).json({ message: 'Quest statistics retrieved successfully', stats});
    } catch (e) {
         console.error('Error fetching quest stats:', e);
         res.status(500).json({ message: 'Server error while fetching quest stats' });
    }
});

module.exports = router;