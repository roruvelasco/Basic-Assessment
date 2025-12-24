import { Document, Types } from 'mongoose';

/**
 * History Interface
 * Represents a single IP search history entry
 */
export interface IHistory extends Document {
    /** Reference to the user who performed the search */
    userId: Types.ObjectId;

    /** The IP address that was searched */
    ip: string;

    /** City name from geolocation */
    city: string;

    /** Region/state name from geolocation */
    region: string;

    /** Full country name */
    country: string;

    /** Country code (e.g., "US", "PH") */
    countryCode: string;

    /** Latitude coordinate (parsed from "loc" field) */
    latitude: number | null;

    /** Longitude coordinate (parsed from "loc" field) */
    longitude: number | null;

    /** Organization/ISP information */
    org: string;

    /** Postal/ZIP code */
    postal: string;

    /** Timezone (e.g., "America/Los_Angeles") */
    timezone: string;

    /** When the search was performed */
    searchedAt: Date;
}
