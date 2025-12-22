import api from './api';

const fetchLatestAnalysis = async () => {
    try {
        const response = await api.get('/analysis/latest');
        return response.data;
    } catch (error) {
        console.error("History fetch failed", error);
        return null; // Return null if fetching history fails, letting the component decide what to do
    }
};

const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Login failed' };
    }
};

const register = async (email, password) => {
    try {
        const response = await api.post('/register', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Registration failed' };
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

export default {
    login,
    register,
    logout,
    fetchLatestAnalysis
};
