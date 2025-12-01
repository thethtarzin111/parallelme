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
// GET /api/quests/stats - Get comprehensive quest statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const allQuests = await Quest.find({ userId: req.userId });
        const completedQuests = allQuests.filter(q => q.status === 'completed');

        // Calculate total points
        const totalPoints = completedQuests.reduce((sum, q) => sum + q.points, 0);

        // Calculate streak (consecutive days with completions)
        const streak = calculateStreak(completedQuests);

        // Calculate confidence score (based on quests completed and difficulty)
        const confidenceScore = calculateConfidenceScore(completedQuests);

        // Get quests by category breakdown
        const categoryBreakdown = {};
        ['Social', 'Academic', 'Personal', 'Creative', 'Career', 'Health'].forEach(cat => {
            categoryBreakdown[cat] = {
                total: allQuests.filter(q => q.category === cat).length,
                completed: completedQuests.filter(q => q.category === cat).length
            };
        });

        // Get weekly progress (last 7 days)
        const weeklyProgress = calculateWeeklyProgress(completedQuests);

        // Get recent activity (last 5 completions)
        const recentActivity = completedQuests
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 5)
            .map(q => ({
                title: q.title,
                category: q.category,
                points: q.points,
                completedAt: q.completedAt
            }));

        // Calculate batch progress
        const currentBatch = Math.max(...allQuests.map(q => q.batchNumber), 0);
        const batchProgress = {
            currentBatch,
            totalBatches: 10,
            percentage: Math.round((currentBatch / 10) * 100)
        };

        const stats = {
            totalQuests: allQuests.length,
            completed: completedQuests.length,
            active: allQuests.filter(q => q.status === 'active').length,
            available: allQuests.filter(q => q.status === 'available').length,
            locked: allQuests.filter(q => q.status === 'locked').length,
            currentBatch,
            totalPoints,
            completionRate: allQuests.length > 0 
                ? Math.round((completedQuests.length / allQuests.length) * 100)
                : 0,
            streak,
            confidenceScore,
            categoryBreakdown,
            weeklyProgress,
            recentActivity,
            batchProgress
        };

        res.status(200).json({
            message: 'Quest statistics retrieved successfully',
            stats
        });
    } catch (error) {
        console.error('Error fetching quest stats:', error);
        res.status(500).json({ message: 'Server error while fetching quest stats' });
    }
});

// Helper function: Calculate streak
function calculateStreak(completedQuests) {
    if (completedQuests.length === 0) return 0;

    // Sort by completion date (newest first)
    const sorted = completedQuests
        .map(q => new Date(q.completedAt))
        .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
        const questDate = new Date(sorted[i]);
        questDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((currentDate - questDate) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
            streak++;
        } else if (diffDays > streak) {
            break;
        }
    }

    return streak;
}

// Helper function: Calculate confidence score
function calculateConfidenceScore(completedQuests) {
    if (completedQuests.length === 0) return 0;

    // Score = (number of quests * 10) + (average difficulty * 5)
    const avgDifficulty = completedQuests.reduce((sum, q) => sum + q.difficultyLevel, 0) / completedQuests.length;
    const score = (completedQuests.length * 10) + (avgDifficulty * 5);
    
    return Math.round(Math.min(score, 100)); // Cap at 100
}

// Helper function: Calculate weekly progress
function calculateWeeklyProgress(completedQuests) {
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = completedQuests.filter(q => {
            const completedDate = new Date(q.completedAt);
            return completedDate >= date && completedDate < nextDate;
        }).length;

        weeklyData.push({
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count
        });
    }

    return weeklyData;
}

module.exports = router;