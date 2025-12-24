import axios from 'axios';

/**
 * API Base Configuration
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies with requests
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Does NOT auto-redirect on 401 - let the app handle auth state
 */
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
