import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

import Login from './pages/auth/Login';
import Home from './pages/homeScreen/Home';
import { authService } from './services/authService';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

/**
 * Main App Component
 */
function App() {
    return (
        <Router>
            <div className="app-container">
                <ReactNotifications />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    {/* Catch all - redirect to login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
