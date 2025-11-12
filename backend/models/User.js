const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true, // Remove whitespaces from beginning and end
        maxlength: [50, 'Name cannot be more than 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Please provdie an email'],
        unique: true, // No two users can have the same email
        lowercase: true, // Convert email to lowercase
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Do not return password field by default
    },
    
    createdAt: {
        type: Date,
        default: Date.now // Set default value to current date
    }
});

// This runs BEFORE saving the user to the database
userSchema.pre('save',async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt which is adding random data to password before hashing
        const salt = await bcrypt.genSalt(8);
        // Hash the password using the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (e) {
        next(e);
    }
});

// Method to check if password is correct duing login
userSchema.methods.comparePassword = async function(canddidatePassword) {
    return await bcrypt.compare(canddidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);