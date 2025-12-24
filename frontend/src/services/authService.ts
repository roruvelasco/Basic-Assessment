import api from './api';

/**
 * Login Credentials Interface
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * User Interface
 */
export interface IUser {
    id: string;
    email: string;
}

/**
 * Login Response Interface
 */
export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: IUser;
}

/**
 * Auth Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Login user with email and password
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/login', credentials);
        return response.data;
    },

    /**
     * Logout user - clear local storage
     */
    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: (): IUser | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Store auth data in localStorage
     */
    setAuthData: (token: string, user: IUser): void => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
};
