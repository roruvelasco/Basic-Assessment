import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect-db';
import healthCheckRoute from './routes/healthCheckRoute';
import loginRoute from './routes/authRoute';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api/health-check', healthCheckRoute);
app.use('/api/login', loginRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
