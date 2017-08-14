import * as mongoose from 'mongoose';

export interface IUser {
    username: string,
    fullname: string,
    password?: string,
    email: string
}

export interface IUserModel extends IUser, mongoose.Document {
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: String,
    created: Date,
    updated: Date
});

export const User = mongoose.model<IUserModel>('User', userSchema);