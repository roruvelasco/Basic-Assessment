import React from 'react';

/**
 * Location Card Props
 */
interface LocationCardProps {
    icon: string;
    label: string;
    value: string;
    className?: string;
}

/**
 * Location Card Component
 * Displays a single location data field with icon and label
 * Features smooth hover effects with scale and glow
 */
const LocationCard: React.FC<LocationCardProps> = ({ icon, label, value, className = '' }) => (
    <div 
        className={`
            bg-slate-900/50 border border-slate-700/50 rounded-xl p-4
            transition-all duration-300 ease-out
            hover:bg-slate-800/70 hover:border-indigo-500/40
            hover:shadow-lg hover:shadow-indigo-500/10
            hover:-translate-y-1 hover:scale-[1.02]
            cursor-default
            ${className}
        `}
    >
        <div className="flex items-center gap-2 mb-1">
            <span className="text-lg transition-transform duration-300 group-hover:scale-110">{icon}</span>
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
        <p className="text-white font-medium truncate" title={value}>{value}</p>
    </div>
);

export default LocationCard;
