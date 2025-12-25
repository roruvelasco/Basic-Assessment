import React, { useState } from 'react';
import { Globe, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { authService } from '../../services/authService';
import { showError, showSuccess } from '../../components/notifications/NotificationService';
import AnimatedBackground from '../../components/AnimatedBackground';

interface LoginProps {
    onLoginSuccess: () => void;
}

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
        <div className="min-h-screen flex items-center justify-center p-[clamp(1rem,4vw,1.5rem)] relative overflow-hidden bg-slate-900">
            <AnimatedBackground />

            <div className="w-full max-w-md relative z-10">
                {/* logo + branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-indigo-500/40 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Globe className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-[clamp(1.75rem,6vw,2.25rem)] font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-[clamp(0.875rem,3vw,1rem)]">
                        Sign in to access IP Geolocation
                    </p>
                </div>

                {/* login card */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-[clamp(1.5rem,5vw,2rem)] shadow-2xl backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1"
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

                        {/* submit button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* demo credentials hint */}
                    <div className="mt-6 pt-5 border-t border-slate-700/50">
                        <p className="text-center text-slate-500 text-sm">
                            Demo: <span className="text-slate-400">sample@gmail.com</span> / <span className="text-slate-400">sample123</span>
                        </p>
                    </div>
                </div>

                {/* footer */}
                <p className="text-center text-slate-600 text-sm mt-6">
                    IP Geolocation Tracker
                </p>
            </div>
        </div>
    );
};

export default Login;
