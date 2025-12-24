import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect-db';
import healthCheckRoute from './routes/healthCheckRoute';
import loginRoute from './routes/authRoute';
import historyRoute from './routes/historyRoute';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser());

// Public Routes
app.use('/api/health-check', healthCheckRoute);
app.use('/api/login', loginRoute);

// Protected Routes (require authentication)
app.use('/api/history', authMiddleware, historyRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
