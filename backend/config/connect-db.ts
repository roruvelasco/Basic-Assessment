import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            console.error('MONGO_URI environment variable is not set');
            throw new Error('MONGO_URI environment variable is not set');
        }

        // Check if already connected (important for serverless)
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // DO NOT use process.exit(1) - it kills Vercel serverless functions!
        throw error; // Re-throw so the error is visible in logs
    }
};

export default connectDB;
