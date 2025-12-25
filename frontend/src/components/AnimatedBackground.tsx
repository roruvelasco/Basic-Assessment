import React from 'react';

// reusable custom animated gradient background
const AnimatedBackground: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-30 -top-64 -right-32 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px] opacity-30 -bottom-48 -left-32 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
);

export default AnimatedBackground;
