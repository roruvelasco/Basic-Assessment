import { Router } from 'express';
import {
    addHistory,
    getHistory,
    getHistoryById,
    deleteHistories,
    clearAllHistory
} from '../controllers/historyController';

const router = Router();

/**
 * History Routes
 * All routes are protected by auth middleware (applied in server.ts)
 */

// GET /api/history - Get all history for logged-in user
router.get('/', getHistory);

// GET /api/history/:id - Get single history record
router.get('/:id', getHistoryById);

// POST /api/history - Add new history entry
router.post('/', addHistory);

// DELETE /api/history - Delete multiple history records
router.delete('/', deleteHistories);

// DELETE /api/history/all - Clear all history
router.delete('/all', clearAllHistory);

export default router;
