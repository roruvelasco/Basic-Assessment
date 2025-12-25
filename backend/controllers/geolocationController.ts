import { Request, Response } from 'express';
import axios from 'axios';

// Check for localhost IP
const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' ||
        ip === '127.0.0.1' ||
        ip === 'localhost' ||
        ip.startsWith('::ffff:127.');
};

// Get client location
const getCurrentLocation = async (req: Request, res: Response) => {
    try {
        const forwardedFor = req.headers['x-forwarded-for'];
        const clientIP = typeof forwardedFor === 'string'
            ? forwardedFor.split(',')[0].trim()
            : req.socket.remoteAddress || '';

        let response;

        // Auto-detect public IP on localhost
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

// Get location by IP
const getLocationByIP = async (req: Request, res: Response) => {
    try {
        const { ip } = req.params;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        // Fetch geo data from ipinfo.io
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
