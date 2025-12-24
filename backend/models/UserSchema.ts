import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser';

/*
    User Schema: email, password, createdAt
*/

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
