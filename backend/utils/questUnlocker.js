const Quest = require('../models/Quest');
const {generatePersonalizedQuests } = require('../services/aiServices')
const Persona = require('../models/Persona')

const checkAndUnclockNextBatch = async (userId) => {
    try {
        // Find user's current highest batch
        const allQuests = await Quest.find({ userId }).sort({ batchNumber: -1 });

        if (allQuests.length === 0) return null;

        const currentBatch = allQuests[0].batchNumber;

        // Check if all rquests in current batch are completed
        const currentBatchNumber = allQuests.filter(q => q.batchNumber === currentBatch)
        const allCompleted = currentBatch.every(q => q.status === 'completed');

        if (!allCompleted) {
            return { unlocked: false, message: 'Complete current batch to unlock next quests'};
        }
        
        // Check if we've hit the max number of batches and quests (10 batches = 30 quests)
        if (currentBatch >= 10) {
            return { unlocked: false, message: 'Congratulations! You\'ve completed all 30 quests! Woohoo!'};
        }

        // Check if next batch already exists
        const nextBatchExists = allQuests.some(q => q.batchNumber === currentBatch + 1);

        if (nextBatchExists) {
            // Just unlock them
            await Quest.updateMany(
                { userId, batchNumber: currentBatch + 1 },
                { status: 'available', unlockedAt: new Date() }
            );
            return { unlocked: true, batchNumber: currentBatch + 1, generated: false };
        }

        // Generate new batch
        const persona = await Persona.findOne({ userId });
        const newQuests = await generatePersonalizedQuests(persona, currentBatch + 1);
        await Quest.insertMany(newQuests);

        return {
            unlocked: true,
            batchNumber: currentBatch + 1,
            generated: true,
            message: `New quests unlocked! Batch ${currentBatch + 1}/10 is ready.`
        };
    } catch (e) {
        console.error('Error unlocking quests:',e);
        throw error;
    }
};

module.exports = { checkAndUnclockNextBatch}