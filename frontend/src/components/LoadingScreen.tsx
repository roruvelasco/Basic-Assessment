import React from 'react';

// fullscreen loading spinner
const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
);

export default LoadingScreen;
