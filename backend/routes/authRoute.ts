import express from 'express';
import { login, checkAuth, logout } from '../controllers/authController';

const router = express.Router();

// POST /api/login - Login and set cookie
router.post('/', login);

// GET /api/login/check - Check if authenticated (validates cookie)
router.get('/check', checkAuth);

// POST /api/login/logout - Logout and clear cookie
router.post('/logout', logout);

export default router;
