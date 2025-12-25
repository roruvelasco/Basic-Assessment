import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            console.error('MONGO_URI environment variable is not set');
            throw new Error('MONGO_URI environment variable is not set');
        }

        // Check if already connected 
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        
        throw error; 
    }
};

export default connectDB;
