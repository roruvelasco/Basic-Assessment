import React, { useState } from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { showError, showSuccess } from '../../components/notifications/NotificationService';

/**
 * Login Props
 */
interface LoginProps {
    onLoginSuccess: () => void;
}

/**
 * Login Page Component
 */
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.login({ email, password });
            showSuccess('Welcome!', 'Login successful');
            
            // Notify parent that login was successful
            setTimeout(() => {
                onLoginSuccess();
            }, 500);

        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            showError('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-900">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-40 -top-48 -right-24 animate-pulse" />
                <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[100px] opacity-40 -bottom-36 -left-24 animate-pulse" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg shadow-indigo-500/30">
                        <Layers className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back</h1>
                    
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-4">
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-4">
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                
            </div>
        </div>
    );
};

export default Login;
