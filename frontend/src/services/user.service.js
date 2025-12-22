import api from './api';

const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Failed to fetch profile' };
    }
};

const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Failed to update profile' };
    }
};

export default {
    getProfile,
    updateProfile
};
