import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Trash2, CheckSquare, Square, Check, ChevronRight, Globe } from 'lucide-react';
import { historyService, type HistoryEntry } from '../services/historyService';
import { showError, showSuccess } from './notifications/NotificationService';
import { SortIcon } from './sorter';

interface HistoryListProps {
    refreshTrigger: number;
    onSelectHistory: (entry: HistoryEntry) => void;
}

// format timestamp nicely
const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const HistoryList: React.FC<HistoryListProps> = memo(({ refreshTrigger, onSelectHistory }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await historyService.getHistory();
            setHistory(data);
            setSelectedIds(new Set());
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load history';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, refreshTrigger]);

    const handleToggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === history.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(history.map(h => h._id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;

        setIsDeleting(true);
        try {
            const idsToDelete = Array.from(selectedIds);
            const result = await historyService.deleteHistories(idsToDelete);
            showSuccess('', `Removed ${result.deletedCount} items`);
            setHistory(prev => prev.filter(h => !selectedIds.has(h._id)));
            setSelectedIds(new Set());
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete';
            showError('Delete Failed', message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleItemClick = (entry: HistoryEntry) => {
        onSelectHistory(entry);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
    };

    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => {
            const dateA = new Date(a.searchedAt).getTime();
            const dateB = new Date(b.searchedAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [history, sortOrder]);

    if (isLoading) {
        return (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mt-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Search History</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mt-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Search History</h2>
                <div className="text-center py-8">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchHistory}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mt-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Search History</h2>
                <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">No search history yet</p>
                    <p className="text-slate-500 text-sm mt-1">Your IP searches will appear here</p>
                </div>
            </div>
        );
    }

    const allSelected = selectedIds.size === history.length;

    return (
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-6 mt-6 backdrop-blur-sm">
            {/* header with actions */}
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white shrink-0">History</h2>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            disabled={isDeleting}
                            className="p-1.5 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 text-sm"
                        >
                            {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">{selectedIds.size}</span>
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleSelectAll}
                        className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-all text-sm flex items-center gap-1.5 ${
                            allSelected 
                                ? 'text-indigo-400 bg-indigo-500/20 hover:bg-indigo-500/30' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                        title={allSelected ? 'Deselect All' : 'Select All'}
                    >
                        {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        <span className="hidden sm:inline">{allSelected ? 'Deselect All' : 'Select All'}</span>
                    </button>
                    <button
                        onClick={toggleSortOrder}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all flex items-center gap-1.5 text-sm"
                        title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
                    >
                        <SortIcon ascending={sortOrder === 'oldest'} />
                        <span className="hidden sm:inline">{sortOrder === 'newest' ? 'New' : 'Old'}</span>
                    </button>
                </div>
            </div>

            {/* list of history items */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {sortedHistory.map((entry) => (
                    <div
                        key={entry._id}
                        onClick={() => handleItemClick(entry)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all group ${
                            selectedIds.has(entry._id)
                                ? 'bg-indigo-500/20 border border-indigo-500/40'
                                : 'bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-900/80'
                        }`}
                    >
                        {/* checkbox */}
                        <div
                            onClick={(e) => handleToggleSelect(entry._id, e)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                selectedIds.has(entry._id)
                                    ? 'bg-indigo-500 border-indigo-500'
                                    : 'border-slate-600 group-hover:border-slate-500'
                            }`}
                        >
                            {selectedIds.has(entry._id) && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                        </div>

                        {/* ip info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-mono font-medium truncate">{entry.ip}</p>
                            <p className="text-slate-400 text-sm truncate hidden sm:block">
                                {entry.city}, {entry.country}
                            </p>
                        </div>

                        {/* when searched */}
                        <div className="text-slate-500 text-sm flex-shrink-0">
                            {formatTimestamp(entry.searchedAt)}
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
});

HistoryList.displayName = 'HistoryList';

export default HistoryList;
