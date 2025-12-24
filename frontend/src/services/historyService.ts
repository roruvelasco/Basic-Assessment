import api from './api';
import type { IGeolocation, ISearchHistory } from '../interfaces/IGeolocation';

/**
 * History Service
 * Handles all IP search history related API calls
 */
export const historyService = {
    /**
     * Get all search history for current user
     */
    getHistory: async (): Promise<ISearchHistory[]> => {
        const response = await api.get<ISearchHistory[]>('/api/history');
        return response.data;
    },

    /**
     * Add a new search to history
     */
    addHistory: async (ipAddress: string, geoData: IGeolocation): Promise<ISearchHistory> => {
        const response = await api.post<ISearchHistory>('/api/history', { ipAddress, geoData });
        return response.data;
    },

    /**
     * Delete multiple history entries by IDs
     */
    deleteHistory: async (historyIds: string[]): Promise<void> => {
        await api.delete('/api/history', { data: { historyIds } });
    },

    /**
     * Clear all history for current user
     */
    clearHistory: async (): Promise<void> => {
        await api.delete('/api/history/all');
    },
};
