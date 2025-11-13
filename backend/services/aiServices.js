const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: dotenv.parsed.CLAUDE_API_KEY
});

/** 
 * Generate a persona description based on user's traits, fears and inspirations
 * @param {Array} traits - Array of desired traits
 * @param {Array} fears - Array of fears to avoid
 * @param {Array} inspirations - Array of inspirational people/things
 * @return {String} - Generated persona description
 */

const generatePersona = async (traits, fears, inspirations) => {
    try{
        console.log('Generating persona with AI ...');
        console.log('Traits:', traits);
        console.log('Fears:', fears);
        console.log('Inspirations:', inspirations);

        // Construct the prompt
        const prompt = `You are a compassionate life coach helping someone envision their best self.
        
        Based on the following information about someone:
        
        **Traits they wish they had:**
        ${traits.map(trait => `- ${trait}`).join('\n')}

        **Fears they want to overcome:**
        ${fears.map(fear => `- ${fear}`).join('\n')}

        **Inspirations they look up to:**
        ${inspirations.map(inspiration => `- ${inspiration}`).join('\n')}

        Write a 2-3 paragraph description of their "alternate self" - a version of them who has developed these traits, overcome these fears, and embodies the qualities of their inspirations.

        Make it:
        - Personal, empathetic and inspiring (use "you" language)
        - Talk like a best friend who truly believes in their potential
        - Can be a bit informal and conversational
        - Vivid and descriptive, helping them visualize this alternate self
        - Realistic but aspirational and achievable
        - Warm and encouraging in tone
        - Focused on growth, possiblity, self-compassion, and empowerment
        - 150 - 250 words long

        Write the description now:`;

        // Call the Claude API
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        // Extract the generated text
        const generatedDescription = response.content[0].text;

        console.log('Persona generation complete.');
        //console.log('Generated Persona Description:', generatedDescription);

        return generatedDescription;
    } catch (error) {
        console.error('Error generating persona description:', error);

        // Handle specific API errors
        if (error.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (error.status >= 401) {
            throw new Error('Authentication error with the AI service. Please check your API key.');
        }
        if (error.status >= 500) {
            throw new Error('AI service is currently unavailable. Please try again later.');
        }

        throw new Error('An error occurred while generating the persona description.');
    }

};

module.exports = { generatePersona };