import { Response } from 'express';
import HistoryModel from '../models/HistorySchema';
import { AuthRequest } from '../interfaces/IAuthRequest';

// Split loc string into lat/lng
const parseLocation = (loc?: string): { latitude: number | null; longitude: number | null } => {
    if (!loc) return { latitude: null, longitude: null };

    const [lat, lng] = loc.split(',');
    return {
        latitude: parseFloat(lat) || null,
        longitude: parseFloat(lng) || null
    };
};

// Add history entry
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

        // Check required fields
        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        // Parse coords
        const { latitude, longitude } = parseLocation(loc);

        // Create record
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

// Get user history
const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Get latest 50 entries
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

// Get single history record
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

        // Ensure ownership
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

// Bulk delete history
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

        // Check for IDs
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'IDs array is required and must not be empty'
            });
        }

        // Execute delete
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

// Clear all history
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
