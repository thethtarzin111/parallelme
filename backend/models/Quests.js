const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Persona',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: String
    },
    category:{
        type: String,
        required: true,
        enum: ['Social','Academic','Personal','Creative','Career','Health']
    },
    difficultyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 10 //1-10 scale for gradual progression
    },
    batchNumber: {
        type: Number,
        required: true // Which set of three is this? (1, 2, 3,...,10)
    },
    status: {
        type: String,
        required: true,
        enum: ['locked', 'available','active','completed'],
        default: 'locked'
    },
    reflection: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    unlockedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
questSchema.index({ userId: 1, batchNumber: 1});
questSchema.index({ userId: 1, status: 1});

module.exports = mongoose.model('Quest', questSchema);


