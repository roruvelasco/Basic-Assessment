import express from 'express';
import { healthCheck } from '../controllers/healthCheckController';

const router = express.Router();

router.get('/', healthCheck);

export default router;
