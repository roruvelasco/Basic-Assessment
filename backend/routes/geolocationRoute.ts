import express from 'express';
import { getCurrentLocation, getLocationByIP } from '../controllers/geolocationController';

const router = express.Router();

// Current location
router.get('/', getCurrentLocation);

// Location by IP
router.get('/:ip', getLocationByIP);

export default router;
