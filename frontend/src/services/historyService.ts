import api from './api';

/**
 * Geolocation data structure (matches IPinfo API response)
 */
export interface GeoData {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
}

/**
 * History entry from database
 */
export interface HistoryEntry {
    _id: string;
    userId: string;
    ip: string;
    city: string;
    region: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    org: string;
    postal: string;
    timezone: string;
    searchedAt: string;
}

/**
 * History Service
 * Handles all IP search history API calls
 */
export const historyService = {
    /**
     * Get all search history for current user
     */
    getHistory: async (): Promise<HistoryEntry[]> => {
        const response = await api.get<{ success: boolean; data: HistoryEntry[] }>('/api/history');
        return response.data.data;
    },

    /**
     * Get a single history entry by ID
     */
    getHistoryById: async (id: string): Promise<HistoryEntry> => {
        const response = await api.get<{ success: boolean; data: HistoryEntry }>(`/api/history/${id}`);
        return response.data.data;
    },

    /**
     * Add a new search to history
     * Accepts raw IPinfo API response format
     */
    addHistory: async (geoData: GeoData): Promise<HistoryEntry> => {
        const response = await api.post<{ success: boolean; data: HistoryEntry }>('/api/history', geoData);
        return response.data.data;
    },

    /**
     * Delete multiple history entries by IDs
     */
    deleteHistories: async (ids: string[]): Promise<{ deletedCount: number }> => {
        const response = await api.delete<{ success: boolean; deletedCount: number }>('/api/history', {
            data: { ids }
        });
        return { deletedCount: response.data.deletedCount };
    },

    /**
     * Clear all history for current user
     */
    clearAllHistory: async (): Promise<{ deletedCount: number }> => {
        const response = await api.delete<{ success: boolean; deletedCount: number }>('/api/history/all');
        return { deletedCount: response.data.deletedCount };
    },
};
