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
 */
const LocationCard: React.FC<LocationCardProps> = ({ icon, label, value, className = '' }) => (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{icon}</span>
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
        <p className="text-white font-medium truncate" title={value}>{value}</p>
    </div>
);

export default LocationCard;
