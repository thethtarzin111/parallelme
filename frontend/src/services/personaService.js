import axios from 'axios';

const API_URL = 'http://localhost:5000/api/personas';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const personaService = {
    getMyPersona: async () => {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    }
}

export default personaService;