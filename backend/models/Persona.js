const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user can have only one persona
    },
    traits: {
        type: [String],
        required: [true, 'Please provide at least one trait'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Traits array cannot be empty'
        }
    },
    fears: {
        type: [String],
        required: [true, 'Please provide at least one fear'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Fears array cannot be empty'
        }
    },
    inspirations: {
        type: [String],
        required: [true, 'Please provide at least one inspiration'],
        validate: {
            validator: function(v) {
                return v && v.length >0;
            },
            message: 'Inspirations array cannot be empty'
        }
    },
    aiGeneratedDescription: {
        type: String,
        required: [true, 'AI generated description is required'],
        minlength: [50, 'Description must be at least 50 characters long'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Persona', personaSchema);