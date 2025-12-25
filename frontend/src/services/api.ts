import axios from 'axios';

// in prod, use relative urls for vercel rewrites (keeps cookies working)
const isProduction = import.meta.env.PROD;
const api = axios.create({
    baseURL: isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000'),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// don't auto-redirect on 401, let app handle it
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
