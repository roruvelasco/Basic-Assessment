/**
 * Geolocation Interfaces
 */

/**
 * Raw API response from ipinfo.io
 */
export interface IGeolocationRaw {
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
 * Parsed geolocation with separated coordinates
 */
export interface IGeolocation {
    ip: string;
    city: string;
    region: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    org: string;
    postal: string;
    timezone: string;
}

/**
 * Search history entry
 */
export interface ISearchHistory {
    _id: string;
    ipAddress: string;
    geoData: IGeolocation;
    createdAt: string;
}
