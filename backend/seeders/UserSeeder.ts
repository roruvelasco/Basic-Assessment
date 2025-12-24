import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import UserModel from '../models/UserSchema';

dotenv.config();

// Please update the test user credentials here :)
const TEST_EMAIL = 'sample@gmail.com';
const TEST_PASSWORD = 'sample123';


/**
 * User Seeder
 */
const seedUser = async () => {
    try {
        // Connect to MongoDB
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if test user already exists
        const existingUser = await UserModel.findOne({ email: TEST_EMAIL });
        if (existingUser) {
            console.log('Test user already exists. Skipping seed.');
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, saltRounds);

        // Create test user
        const testUser = await UserModel.create({
            email: TEST_EMAIL,
            password: hashedPassword
        });

        console.log('Test user created successfully!');

        await mongoose.connection.close();
        

    } catch (error) {
        console.error('Seeder error:', error);
        process.exit(1);
    }
};

seedUser();
