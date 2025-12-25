import api from './api';
import { isIP } from 'is-ip';
import type { IGeolocationRaw, IGeolocation } from '../interfaces/IGeolocation';

// transform raw ipinfo response into our app's format
const parseGeolocation = (raw: IGeolocationRaw): IGeolocation => {
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (raw.loc) {
        const [lat, lng] = raw.loc.split(',');
        latitude = parseFloat(lat) || null;
        longitude = parseFloat(lng) || null;
    }

    return {
        ip: raw.ip,
        city: raw.city || 'Unknown',
        region: raw.region || 'Unknown',
        country: raw.country || 'Unknown',
        latitude,
        longitude,
        org: raw.org || 'Unknown',
        postal: raw.postal || 'Unknown',
        timezone: raw.timezone || 'Unknown',
    };
};

// validates both IPv4 and IPv6
export const isValidIPAddress = (ip: string): boolean => {
    return isIP(ip);
};

export const geolocationService = {
    // get location for current user (backend figures out the IP)
    getCurrentLocation: async (): Promise<IGeolocation> => {
        try {
            const response = await api.get<{ success: boolean; data: IGeolocationRaw }>('/api/geolocation');
            return parseGeolocation(response.data.data);
        } catch (error) {
            console.error('Failed to fetch current location:', error);
            throw new Error('Unable to fetch your location. Please try again.');
        }
    },

    // look up a specific IP
    getLocationByIP: async (ip: string): Promise<IGeolocation> => {
        if (!isValidIPAddress(ip)) {
            throw new Error('Invalid IP address format');
        }

        try {
            const response = await api.get<{ success: boolean; data: IGeolocationRaw }>(`/api/geolocation/${ip}`);
            return parseGeolocation(response.data.data);
        } catch (error) {
            console.error('Failed to fetch location for IP:', ip, error);
            throw new Error(`Unable to fetch location for IP: ${ip}`);
        }
    },
};
