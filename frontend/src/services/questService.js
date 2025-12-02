import api from './api'; // Existing API config with base URL and auth
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quests';

const questService = {
    // Get all available and active quests
    getQuests: async () => {
        const response = await api.get('/quests');
        return response.data;
    },

    // Get completed quests
    getCompletedQuests: async () => {
        const response = await api.get('/quests/completed');
        return response.data;
    },

    // Get quest statistics
    getQuestStats: async () => {
        const response = await api.get('/quests/stats');
        return response.data;
    },

    // Start a quest
    startQuest: async (questId) => {
        const response = await api.post(`/quests/${questId}/start`);
        return response.data;
    },

    // Complete a quest
    completeQuest: async(questId, reflection) => {
        const response = await api.put(`/quests/${questId}/complete`, { reflection });
        return response.data;
    }
};

export default questService;