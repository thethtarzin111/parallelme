import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stories';

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const storyService = {
    // Generate quest completion snippet
    generateQuestSnippet: async (questId) => {
        try {
            const response = await axios.post(
                `${API_URL}/quest-snippet`,
                { questId },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error generating quest snippet:', error);
            throw error;
        }
    },

    // Generate batch completion chapter
    generateBatchChapter: async (batchNumber) => {
        try {
            const response = await axios.post(
                `${API_URL}/batch-chapter`,
                { batchNumber },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error generating batch chapter:', error);
            throw error;
        }
    },

    // Get all user's stories
    getAllStories: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    }
};

export default storyService;