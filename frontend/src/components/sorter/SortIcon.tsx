import React from 'react';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

interface SortIconProps {
    ascending: boolean;
    className?: string;
}

// shows up/down arrow based on sort direction
const SortIcon: React.FC<SortIconProps> = ({ ascending, className = 'w-4 h-4' }) => (
    ascending 
        ? <ArrowUpAZ className={className} /> 
        : <ArrowDownAZ className={className} />
);

export default SortIcon;
