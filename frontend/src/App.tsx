import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { useState, useEffect } from 'react';
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
 */
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const result = await authService.checkAuth();
            setIsAuthenticated(result.authenticated);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking auth
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <div className="app-container">
                <ReactNotifications />
                <Routes>
                    {/* Login - redirects to home if authenticated */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated
                                ? <Navigate to="/home" replace />
                                : <Login onLoginSuccess={() => setIsAuthenticated(true)} />
                        }
                    />
                    
                    {/* Home - requires authentication */}
                    <Route
                        path="/home"
                        element={
                            isAuthenticated
                                ? <Home onLogout={() => setIsAuthenticated(false)} />
                                : <Navigate to="/" replace />
                        }
                    />
                    
                    {/* Catch all */}
                    <Route
                        path="*"
                        element={
                            <Navigate to={isAuthenticated ? "/home" : "/"} replace />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
