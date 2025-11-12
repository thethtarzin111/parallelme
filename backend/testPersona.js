const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Persona = require('./models/Persona');

async function testPersonaModel() {
    try {
        // Connect to MongoDB
        await mongoose.connect(dotenv.parsed.MONGO_URI);
        console.log('Connected to MongoDB for testing Persona model');

        // Create a test Persona (use a real userID from database)
        const testPersona = new Persona({
            userId: new mongoose.Types.ObjectId(),
            traits: ['confident', 'creative', 'ambitious'],
            fears: ['failure', 'rejection'],
            inspirations: ['Marie Curie', 'Elon Musk'],
            aiGeneratedDescription: 'A confident, creative, and ambitious individual driven by innovation and inspired by visionaries like Marie Curie and Elon Musk, yet wary of failure and rejection.'

        })

            // Save to database
            await testPersona.save();
            console.log('Test Persona saved successfully:', testPersona);

            // Fetch the Persona back from database
            const fetchedPersona = await Persona.findById(testPersona._id);
            console.log('Fetched Persona:', fetchedPersona);

            // Clean up - delete the test Persona
            //await Persona.findByIdAndDelete(testPersona._id);
            //console.log('Test Persona deleted successfully');

            console.log('Persona model test completed successfully');
            process.exit(0);
    } catch (e) {
        console.error('Error during Persona model test:', e);
        process.exit(1);
    }
}

testPersonaModel();