import api from './api';

const analyzeProfile = async (formData) => {
    try {
        // Content-Type is multipart/form-data for file uploads, axios handles this automatically when passing FormData
        const response = await api.post('/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Analysis failed' };
    }
};

const rerunAnalysis = async () => {
    try {
        const response = await api.post('/analyze/rerun');
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Rerun analysis failed' };
    }
};

const getLatestAnalysis = async () => {
    try {
        const response = await api.get('/analysis/latest');
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Failed to fetch latest analysis' };
    }
}

export default {
    analyzeProfile,
    rerunAnalysis,
    getLatestAnalysis
};
