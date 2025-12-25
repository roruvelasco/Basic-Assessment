import express from 'express';
import { getCurrentLocation, getLocationByIP } from '../controllers/geolocationController';

const router = express.Router();

// GET /api/geolocation - Get current user's geolocation (uses real client IP)
router.get('/', getCurrentLocation);

// GET /api/geolocation/:ip - Get geolocation for specific IP
router.get('/:ip', getLocationByIP);

export default router;
