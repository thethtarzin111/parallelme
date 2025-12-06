import api from './api';

const storyService = {
    // Generate quest completion snippet
    generateQuestSnippet: async (questId) => {
        try {
            const response = await api.post('/stories/quest-snippet', { questId });
            return response.data;
        } catch (error) {
            console.error('Error generating quest snippet:', error);
            throw error;
        }
    },

    // Generate batch completion chapter
    generateBatchChapter: async (batchNumber) => {
        try {
            const response = await api.post('/stories/batch-chapter', { batchNumber });
            return response.data;
        } catch (error) {
            console.error('Error generating batch chapter:', error);
            throw error;
        }
    },

    // Get all user's stories
    getAllStories: async () => {
        try {
            const response = await api.get('/stories');
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    }
};

export default storyService;