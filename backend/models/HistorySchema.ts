import mongoose, { Schema } from 'mongoose';
import { IHistory } from '../interfaces/IHistory';

/**
 * History Schema
 * Stores IP geolocation search history for each user
 * 
 * Fields are based on IPinfo API response:
 * { ip, city, region, country, loc, org, postal, timezone }
 */
const HistorySchema: Schema = new Schema({
    /** Reference to the user who performed the search */
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index for faster user-specific queries
    },

    /** The IP address that was searched */
    ip: {
        type: String,
        required: true
    },

    /** City name from geolocation */
    city: {
        type: String,
        default: 'Unknown'
    },

    /** Region/state name from geolocation */
    region: {
        type: String,
        default: 'Unknown'
    },

    /** Full country name (derived from countryCode) */
    country: {
        type: String,
        default: 'Unknown'
    },

    /** Country code from API (e.g., "US", "PH") */
    countryCode: {
        type: String,
        default: 'Unknown'
    },

    /** Latitude coordinate (parsed from "loc" field) */
    latitude: {
        type: Number,
        default: null
    },

    /** Longitude coordinate (parsed from "loc" field) */
    longitude: {
        type: Number,
        default: null
    },

    /** Organization/ISP information */
    org: {
        type: String,
        default: 'Unknown'
    },

    /** Postal/ZIP code */
    postal: {
        type: String,
        default: 'Unknown'
    },

    /** Timezone (e.g., "America/Los_Angeles") */
    timezone: {
        type: String,
        default: 'Unknown'
    },

    /** When the search was performed */
    searchedAt: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by date
    }
});

// Compound index for efficient queries on user's history sorted by date
HistorySchema.index({ userId: 1, searchedAt: -1 });

const HistoryModel = mongoose.model<IHistory>('History', HistorySchema);
export default HistoryModel;
