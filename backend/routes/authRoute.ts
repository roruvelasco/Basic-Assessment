import express from 'express';
import { login, checkAuth, logout } from '../controllers/authController';

const router = express.Router();

// Login route
router.post('/', login);

// Auth check
router.get('/check', checkAuth);

// Logout
router.post('/logout', logout);

export default router;
