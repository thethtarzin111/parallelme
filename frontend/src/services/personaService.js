import api from './api';

const personaService = {
    getMyPersona: async () => {
        const response = await api.get('/personas/me');
        return response.data;
    }
}

export default personaService;