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
    } catch (e) {
        console.error('Error generating persona description:', error);

        // Handle specific API errors
        if (e.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (e.status >= 401) {
            throw new Error('Authentication error with the AI service. Please check your API key.');
        }
        if (e.status >= 500) {
            throw new Error('AI service is currently unavailable. Please try again later.');
        }

        throw new Error('An error occurred while generating the persona description.');
    }

};

const generatePersonalizedQuests = async (persona, batchNumber) => {
    const Quest = require('../models/Quests');
    const QUEST_CONFIG = require('../utils/questProgression');

    // Get difficulty range for this batch
    const difficultyRange = QUEST_CONFIG.DIFFICULTY_RANGES.find(
        d => d.batch === batchNumber
    );

    const prompt = `You are a supportive personal growth coach helping someone become their best self.
    
    PERSONA DESCRIPTION:
    ${persona.aiGeneratedDescription}
    
    THEIR FEARS:
    ${persona.fears.join(', ')}
    
    TRAITS THEY WANT TO DEVELOP:
    ${persona.traits.join(', ')}
    
    WHO INSPIRES THEM:
    ${persona.inspirations.join(', ')}
    
    TASK: Generate 3 personalized confidence-building, self-esteem increasing quests for Batch ${batchNumber} (out of 10 total batches).
    
    DIFFICULTY LEVEL: ${difficultyRange.min} to ${difficultyRange.max} out of 10
    ${batchNumber === 1 ? 'These are their FIRST quests - make them achievable and encouraging!' : ''}
    ${batchNumber === 10 ? 'These are their FINAL quests - make them transformative and challenging!' : ''}
    
    IMPORTANT GUIDELINES:
    - Quests should directly help them overcome their fears or develop their desired traits
    - Each quest should be ONE specific, actionable task they can complete in 1-7 days
    - Graudally increase difficulty: Quest 1 (${difficultyRange.min}), Quest 2 (${(difficultyRange.min + difficultyRange.max)/2}), Quest 3 (${difficultyRange.max})
    - Make quests SPECIFIC to their persona, not generic advice
    - Focus on small, concrete actions that build confidence through doing
    - Categories: Social, Academic, Personal, Creative, Career, or Health
    
    Return ONLY valid JSON (no markdown, no code blocks):
    [
        {
            "title": "Short, inspiring title (max 8 words)",
            "description": "Clear description of what to do and why it matters for them (2-3 sentences)",
            "category": "Social|Academic|Personal|Creative|Career|Health",
            "difficultyLevel": 1.0
        },
        {
            "title": "...",
            "description":"...",
            "category":"...",
            "difficultyLevel": 2.5
        },
        {
            "title": "...",
            "description": "...",
            "category": "...",
            "difficultyLevel": 3.0
        }
    ]`;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt}]
        });

        let questsData = response.content[0].text;

        // Clean up response (remove markdown if present)
        questsData = questsData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON string into an array
        const parsedQuests = JSON.parse(questsData);

        // Validate that we got an array of 3 quests
        if (!Array.isArray(parsedQuests) || parsedQuests.length !== 3) {
            throw new Error('AI did not return exactly 3 quests');
        }

        // Validate and create quest documents with defaults
        const quests = parsedQuests.map((q, index) => {
            // Validate required fields
            if (!q.title || !q.description || !q.difficultyLevel) {
                throw new Error(`Quest ${index + 1} is missing required fields`);
            }

            // Ensure category is valid (provide default if missing/invalid)
            const validCategories = ['Social', 'Academic', 'Personal', 'Creative', 'Career', 'Health'];
            let category = q.category;
            
            if (!category || !validCategories.includes(category)) {
                console.warn(`Quest "${q.title}" has invalid/missing category. Defaulting to "Personal"`);
                category = 'Personal'; // Default fallback
            }

            return {
                userId: persona.userId,
                personaId: persona._id,
                title: q.title.trim(),
                description: q.description.trim(),
                category: category,
                difficultyLevel: parseFloat(q.difficultyLevel), // Ensure it's a number
                batchNumber: batchNumber,
                status: batchNumber === 1 ? 'available' : 'locked',
                points: QUEST_CONFIG.calculatePoints(q.difficultyLevel),
                unlockedAt: batchNumber === 1 ? new Date() : null
            };
        });

        console.log('Generated quests:', JSON.stringify(quests, null, 2)); // For debugging  

        return quests;
        
    } catch (e) {
        console.error('Quest generation error:', e)

        // Handle specific API errors
        if (e.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (e.status >= 401) {
            throw new Error('Authentication error with the AI service. Please check your API key.');
        }
        if (e.status >= 500) {
            throw new Error('AI service is currently unavailable. Please try again later.');
        }

        throw new Error('Failed to generated personalized quetss')
    }
}

// Short story snippet after completing a quest
const generateQuestSnippet = async (persona, questTitle, reflection) => {
    try {
        const prompt = `You are a creative writer helping someone visualize their personal growth journey.

        CONTEXT:
        - This person has an alternate self (their ideal future self): "${persona.aiGeneratedDescription}"
        - They just completed a confidence-building quest: "${questTitle}"
        - Their reflection on completing it: "${reflection}"

        TASK:
        Write a SHORT, inspiring 50-80 word story snippet showing their alternate self taking a small step forward on their journey. Make it feel personal, hopeful, and connected to the quest they just completed.

        Style: Second person ("You"), present tense, vivid imagery
        Tone: Encouraging, cinematic, empowering

        Do NOT use quotation marks or dialogue. Write it as a mini movie scene.`;

            const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }]
            });

            return response.content[0].text.trim();
    } catch (error) {
        console.error('Error generating quest snippet:', error);
        throw new Error('Failed to generate story snippet');
    }
};

// Long story chapter after commpleting a batch
const generateBatchChapter = async (persona, batchNumber, completedQuests) => {
    try {
        // Create a summary of the quests they completed
        const questsSummary = completedQuests.map(q => `- ${q.questTitle}`).join('\n');

        const prompt = `You are a creative writer helping someone visualize their personal growth journey.

        CONTEXT:
        - This person has an alternate self (their ideal future self): "${persona.aiGeneratedDescription}"
        - They just completed Batch ${batchNumber} of their confidence-building journey (out of 10 total batches)
        - Quests they completed in this batch:
        ${questsSummary}

        PROGRESS CONTEXT:
        ${batchNumber === 1 ? '- This is their very first batch! The journey begins.' : ''}
        ${batchNumber >= 5 ? '- They\'re halfway through their transformation!' : ''}
        ${batchNumber === 10 ? '- This is their FINAL batch! The journey culminates here.' : ''}

        TASK:
        Write a 200-250 word story chapter showing their alternate self overcoming a significant challenge or reaching a meaningful milestone. Make it feel like Chapter ${batchNumber} of their hero's journey.

        Style: Second person ("You"), past tense, narrative story format
        Tone: Inspiring, cinematic, emotionally resonant
        Structure: Setup → Challenge → Breakthrough

        Include:
        - A specific scene or moment
        - An internal struggle or fear faced
        - A moment of courage or growth
        - A sense of progression

        Do NOT:
        - Use quotation marks or dialogue
        - Make it generic - tie it to their persona and progress
        - Rush the ending`;
            
            const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 500,
            messages: [{ role: "user", content: prompt }]
            });

            return response.content[0].text.trim();
    } catch (error) {
        console.error('Error generating batch chapter:', error);
        throw new Error('Failed to generate story chapter');
    }
};

module.exports = { generatePersona, generatePersonalizedQuests, generateQuestSnippet, generateBatchChapter };