import { Router } from 'express';
import {
    addHistory,
    getHistory,
    getHistoryById,
    deleteHistories,
    clearAllHistory
} from '../controllers/historyController';

const router = Router();

// History routes (protected)

// Get all history
router.get('/', getHistory);

// Get single record
router.get('/:id', getHistoryById);

// Add entry
router.post('/', addHistory);

// Delete multiple
router.delete('/', deleteHistories);

// Clear all
router.delete('/all', clearAllHistory);

export default router;
