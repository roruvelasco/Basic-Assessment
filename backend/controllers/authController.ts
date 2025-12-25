import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserSchema';

/**
 * Login Controller
 * Validates user credentials and returns a JWT token
 */
const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie (not accessible by JavaScript)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * Check if user is authenticated (validates cookie)
 */
const checkAuth = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message: 'Not authenticated'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
            email: string;
        };

        // Get user info
        const user = await UserModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            authenticated: true,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            authenticated: false,
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Logout - clears the auth cookie
 */
const logout = async (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

export { login, checkAuth, logout };
