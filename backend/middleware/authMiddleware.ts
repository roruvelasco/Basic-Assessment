import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Verifies JWT token from cookie or Authorization header
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
            email: string;
        };

        // Attach user info to request
        (req as any).userId = decoded.userId;
        (req as any).email = decoded.email;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default authMiddleware;
