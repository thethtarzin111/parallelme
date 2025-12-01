const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    storyType: {
        type: String,
        enum: ['quest_snippet', 'batch_chapter'],
        required: true
    },
    // What triggered this story?
    triggeredBy: {
        type: String, // questId or batchNumber
        required: true
    },
    // For batch chapters, store which batch it belongs to (1 -10)
    batchNumber: {
        type: Number,
        min: 1,
        max: 10
    },
    // For quest snippets, store quest title
    questTitle: String,

    generatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast queries
storySchema.index({ userId: 1, generatedAt: -1});

module.exports = mongoose.model('Story', storySchema);
