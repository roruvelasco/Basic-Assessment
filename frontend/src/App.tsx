import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Login from './pages/auth/Login';
import Home from './pages/homeScreen/Home';
import LoadingScreen from './components/LoadingScreen';
import { authService } from './services/authService';
import { NotificationProvider, useNotification, setNotificationFunctions } from './components/notifications/NotificationService';

// bridge to set notification functions for non-component usage
const NotificationBridge = () => {
    const notifications = useNotification();
    useEffect(() => {
        setNotificationFunctions(notifications);
    }, [notifications]);
    return null;
};

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoginSuccess = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const result = await authService.checkAuth();
                setIsAuthenticated(result.authenticated);
                if (result.authenticated && result.user) {
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: isAuthenticated 
                ? <Navigate to="/home" replace /> 
                : <Login onLoginSuccess={handleLoginSuccess} />,
        },
        {
            path: '/home',
            element: isAuthenticated 
                ? <Home onLogout={handleLogout} /> 
                : <Navigate to="/" replace />,
        },
        {
            path: '*',
            element: <Navigate to={isAuthenticated ? '/home' : '/'} replace />,
        },
    ]);

    return (
        <div className="app-container">
            <RouterProvider router={router} />
        </div>
    );
}

function App() {
    return (
        <NotificationProvider>
            <NotificationBridge />
            <AppContent />
        </NotificationProvider>
    );
}

export default App;
