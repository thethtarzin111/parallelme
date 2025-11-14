// Quest progression configuration

const QUEST_CONFIG = {
    QUEST_PER_BATCH: 3,
    TOTAL_BATCHES: 10,
    TOTAL_QUESTS: 30,

    // Difficulty ranges for each batch
    DIFFICULTY_RANGES: [
        { batch: 1, min: 1, max: 2}, // Super gentle and relaxed start
        { batch: 2, min: 2, max: 3},
        { batch: 3, min: 3, max: 4},
        { batch: 4, min: 4, max: 5},
        { batch: 5, min: 5, max: 6},
        { batch: 6, min: 6, max: 7},
        { batch: 7, min: 7, max: 8},
        { batch: 8, min: 8, max: 9},
        { batch: 9, min: 9, max: 9.5},
        { batch: 10, min: 9.5, max: 10} // Most challenging
    ],

    // Points increase with diffculty
    calculatePoints: (difficultyLevel) => {
        return Math.round (difficultyLevel * 5);
    }
};

module.exports = QUEST_CONFIG;