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
    user: IUser;
}

/**
 * Auth Check Response Interface
 */
export interface AuthCheckResponse {
    success: boolean;
    authenticated: boolean;
    user?: IUser;
    message?: string;
}

/**
 * Auth Service
 * Cookie-based authentication (no localStorage for tokens)
 */
export const authService = {
    /**
     * Login user with email and password
     * Cookie is set automatically by the server
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/login', credentials);
        // Store user info only (not token - that's in the httpOnly cookie)
        if (response.data.user) {
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Logout user - clears cookie on server and local session
     */
    logout: async (): Promise<void> => {
        try {
            await api.post('/api/login/logout');
        } finally {
            sessionStorage.removeItem('user');
        }
    },

    /**
     * Check if user is authenticated (validates cookie with server)
     */
    checkAuth: async (): Promise<AuthCheckResponse> => {
        try {
            const response = await api.get<AuthCheckResponse>('/api/login/check');
            return response.data;
        } catch {
            return { success: false, authenticated: false };
        }
    },

    /**
     * Get current user from session storage
     */
    getCurrentUser: (): IUser | null => {
        const userStr = sessionStorage.getItem('user');
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
     * Quick check if user might be authenticated (for initial render)
     * Use checkAuth() for definitive server-side validation
     */
    hasSession: (): boolean => {
        return !!sessionStorage.getItem('user');
    },
};
