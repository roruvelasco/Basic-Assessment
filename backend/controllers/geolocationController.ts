import { Request, Response } from 'express';
import axios from 'axios';

// check if IP is localhost/loopback
const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' ||
        ip === '127.0.0.1' ||
        ip === 'localhost' ||
        ip.startsWith('::ffff:127.');
};

// get current user's location
const getCurrentLocation = async (req: Request, res: Response) => {
    try {
        const forwardedFor = req.headers['x-forwarded-for'];
        const clientIP = typeof forwardedFor === 'string'
            ? forwardedFor.split(',')[0].trim()
            : req.socket.remoteAddress || '';

        let response;

        // on localhost, let ipinfo auto-detect our public IP
        if (!clientIP || isLocalhostIP(clientIP)) {
            response = await axios.get('https://ipinfo.io/geo');
        } else {
            response = await axios.get(`https://ipinfo.io/${clientIP}/geo`);
        }

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Geolocation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch geolocation'
        });
    }
};

/**
 * Get geolocation for a specific IP address
 */
const getLocationByIP = async (req: Request, res: Response) => {
    try {
        const { ip } = req.params;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        // Call ipinfo.io with the specified IP
        const response = await axios.get(`https://ipinfo.io/${ip}/geo`);

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Geolocation error for IP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch geolocation for specified IP'
        });
    }
};

export { getCurrentLocation, getLocationByIP };
