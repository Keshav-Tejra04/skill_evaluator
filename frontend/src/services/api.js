import axios from 'axios';

// Create axios instance
let baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Render provides the host (e.g. example.onrender.com) without protocol via 'host' property
if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL}`;
}

// Remove trailing slash if present
if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
