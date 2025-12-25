import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    email: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user: IUser;
}

export interface AuthCheckResponse {
    success: boolean;
    authenticated: boolean;
    user?: IUser;
    message?: string;
}

export const authService = {
    // login - cookie gets set by server automatically
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/login', credentials);
        // store user info locally (token lives in httpOnly cookie)
        if (response.data.user) {
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // logout - clear cookie + session
    logout: async (): Promise<void> => {
        try {
            await api.post('/api/login/logout');
        } finally {
            sessionStorage.removeItem('user');
        }
    },

    // check if we're still logged in (validates cookie server-side)
    checkAuth: async (): Promise<AuthCheckResponse> => {
        try {
            const response = await api.get<AuthCheckResponse>('/api/login/check');
            return response.data;
        } catch {
            return { success: false, authenticated: false };
        }
    },

    // get stored user from session
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

    // quick local check if user might be logged in
    hasSession: (): boolean => {
        return !!sessionStorage.getItem('user');
    },
};
