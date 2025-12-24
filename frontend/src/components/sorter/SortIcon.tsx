import React from 'react';

interface SortIconProps {
    ascending: boolean;
    className?: string;
}

/**
 * Sort Icon Component
 * Shows an up or down arrow based on sort direction
 */
const SortIcon: React.FC<SortIconProps> = ({ ascending, className = 'w-4 h-4' }) => (
    <svg 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        {ascending ? (
            <>
                <path d="M3 8l4 4 4-4" />
                <path d="M7 4v12" />
                <path d="M11 12h4M11 16h7M11 20h10" />
            </>
        ) : (
            <>
                <path d="M3 16l4-4 4 4" />
                <path d="M7 20V8" />
                <path d="M11 12h10M11 16h7M11 20h4" />
            </>
        )}
    </svg>
);

export default SortIcon;
