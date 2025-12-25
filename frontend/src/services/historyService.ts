import api from './api';

// matches ipinfo api response
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

// what we get back from our db
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

export const historyService = {
    // fetch all history for current user
    getHistory: async (): Promise<HistoryEntry[]> => {
        const response = await api.get<{ success: boolean; data: HistoryEntry[] }>('/api/history');
        return response.data.data;
    },

    // get single entry
    getHistoryById: async (id: string): Promise<HistoryEntry> => {
        const response = await api.get<{ success: boolean; data: HistoryEntry }>(`/api/history/${id}`);
        return response.data.data;
    },

    // save new search
    addHistory: async (geoData: GeoData): Promise<HistoryEntry> => {
        const response = await api.post<{ success: boolean; data: HistoryEntry }>('/api/history', geoData);
        return response.data.data;
    },

    // bulk delete
    deleteHistories: async (ids: string[]): Promise<{ deletedCount: number }> => {
        const response = await api.delete<{ success: boolean; deletedCount: number }>('/api/history', {
            data: { ids }
        });
        return { deletedCount: response.data.deletedCount };
    },

    // wipe everything
    clearAllHistory: async (): Promise<{ deletedCount: number }> => {
        const response = await api.delete<{ success: boolean; deletedCount: number }>('/api/history/all');
        return { deletedCount: response.data.deletedCount };
    },
};
