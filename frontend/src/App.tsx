import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { useState, useEffect, useCallback } from 'react';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

import Login from './pages/auth/Login';
import Home from './pages/homeScreen/Home';
import { authService } from './services/authService';

/**
 * Loading Spinner Component
 */
const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
);

/**
 * Main App Component
 * Uses createBrowserRouter for modern React Router v6.4+ data APIs
 */
function App() {
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

    // Show loading while checking auth
    if (isLoading) {
        return (
            <>
                <ReactNotifications />
                <LoadingScreen />
            </>
        );
    }

    // Create router with object-based route definitions
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
            <ReactNotifications />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
