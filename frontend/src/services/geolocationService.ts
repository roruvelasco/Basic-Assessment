import axios from 'axios';
import { IPINFO_API_URL } from '../config/config';
import type { IGeolocationRaw, IGeolocation } from '../interfaces/IGeolocation';

/**
 * Parse raw API response into structured geolocation data
 */
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

/**
 * Validate IP address format (IPv4)
 */
export const isValidIPAddress = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
};

/**
 * Geolocation Service
 */
export const geolocationService = {
    /**
     * Get current user's IP location
     */
    getCurrentLocation: async (): Promise<IGeolocation> => {
        try {
            const response = await axios.get<IGeolocationRaw>(`${IPINFO_API_URL}//geo`);
            return parseGeolocation(response.data);
        } catch (error) {
            console.error('Failed to fetch current location:', error);
            throw new Error('Unable to fetch your location. Please try again.');
        }
    },

    /**
     * Get location by specific IP address
     */
    getLocationByIP: async (ip: string): Promise<IGeolocation> => {
        if (!isValidIPAddress(ip)) {
            throw new Error('Invalid IP address format');
        }

        try {
            const response = await axios.get<IGeolocationRaw>(`${IPINFO_API_URL}/${ip}/geo`);
            return parseGeolocation(response.data);
        } catch (error) {
            console.error('Failed to fetch location for IP:', ip, error);
            throw new Error(`Unable to fetch location for IP: ${ip}`);
        }
    },
};
