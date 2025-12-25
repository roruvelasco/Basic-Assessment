import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect-db';
import healthCheckRoute from './routes/healthCheckRoute';
import loginRoute from './routes/authRoute';
import historyRoute from './routes/historyRoute';
import geolocationRoute from './routes/geolocationRoute';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();

// Database connection
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Global middleware
app.use(express.json());
// CORS setup
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser requests (mobile/postman)
        if (!origin) return callback(null, true);

        // Check against allowed origins
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.error('CORS blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());

// Public Routes
app.use('/api/health-check', healthCheckRoute);
app.use('/api/login', loginRoute);
app.use('/api/geolocation', geolocationRoute);

// Protected Routes
app.use('/api/history', authMiddleware, historyRoute);

// Start server (Vercel handles this differently in serverless)
// Start server if not on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;

