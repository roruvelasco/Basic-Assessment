// raw response from ipinfo api
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

// parsed version with lat/lng split out
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

export interface ISearchHistory {
    _id: string;
    ipAddress: string;
    geoData: IGeolocation;
    createdAt: string;
}
