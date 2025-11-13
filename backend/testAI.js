// backend/testAI.js
require('dotenv').config();
const { generatePersona } = require('./services/aiServices');

const testPersonaGeneration = async () => {
    try {
        console.log('Testing AI persona generation...\n');

        const testTraits = ['confident', 'creative', 'articulate'];
        const testFears = ['public speaking', 'rejection'];
        const testInspirations = ['Michelle Obama', 'Steve Jobs'];

        const description = await generatePersona(testTraits, testFears, testInspirations);

        console.log('\n📝 Generated Description:\n');
        console.log(description);
        console.log('\n✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

testPersonaGeneration();