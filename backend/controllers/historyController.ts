import { Request, Response } from 'express';
import HistoryModel from '../models/HistorySchema';

/**
 * Extended Request interface with user info from auth middleware
 */
interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}

/**
 * Parse "loc" field into separate latitude and longitude
 * Format: "37.4056,-122.0775"
 */
const parseLocation = (loc?: string): { latitude: number | null; longitude: number | null } => {
    if (!loc) return { latitude: null, longitude: null };

    const [lat, lng] = loc.split(',');
    return {
        latitude: parseFloat(lat) || null,
        longitude: parseFloat(lng) || null
    };
};

/**
 * POST /api/history
 * Add a new IP search to history
 */
const addHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { ip, city, region, country, loc, org, postal, timezone } = req.body;

        // Validate IP address
        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        // Parse location string
        const { latitude, longitude } = parseLocation(loc);

        // Create new history entry
        const historyEntry = new HistoryModel({
            userId,
            ip,
            city: city || 'Unknown',
            region: region || 'Unknown',
            country: country || 'Unknown',
            countryCode: country || 'Unknown',
            latitude,
            longitude,
            org: org || 'Unknown',
            postal: postal || 'Unknown',
            timezone: timezone || 'Unknown',
            searchedAt: new Date()
        });

        await historyEntry.save();

        return res.status(201).json({
            success: true,
            message: 'History entry added',
            data: historyEntry
        });

    } catch (error) {
        console.error('Add history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add history entry'
        });
    }
};

/**
 * GET /api/history
 * Get all search history for the logged-in user
 */
const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Fetch history sorted by newest first, limit to 50
        const history = await HistoryModel.find({ userId })
            .sort({ searchedAt: -1 })
            .limit(50)
            .lean();

        return res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Get history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch history'
        });
    }
};

/**
 * GET /api/history/:id
 * Get a single history record by ID
 */
const getHistoryById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const historyEntry = await HistoryModel.findById(id).lean();

        if (!historyEntry) {
            return res.status(404).json({
                success: false,
                message: 'History record not found'
            });
        }

        // Security check: verify record belongs to user
        if (historyEntry.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        return res.status(200).json({
            success: true,
            data: historyEntry
        });

    } catch (error) {
        console.error('Get history by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch history record'
        });
    }
};

/**
 * DELETE /api/history
 * Delete multiple history records
 */
const deleteHistories = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { ids } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Validate IDs array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'IDs array is required and must not be empty'
            });
        }

        // Delete only records belonging to this user
        const result = await HistoryModel.deleteMany({
            _id: { $in: ids },
            userId: userId
        });

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} history record(s)`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Delete histories error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete history records'
        });
    }
};

/**
 * DELETE /api/history/all
 * Clear all history for the logged-in user
 */
const clearAllHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const result = await HistoryModel.deleteMany({ userId });

        return res.status(200).json({
            success: true,
            message: `Successfully cleared all history (${result.deletedCount} records)`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Clear all history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to clear history'
        });
    }
};

export { addHistory, getHistory, getHistoryById, deleteHistories, clearAllHistory };
