import { Request } from 'express';

/**
 * Extended Request interface with authenticated user info
 * Used by auth middleware to attach user data to requests
 */
export interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}
