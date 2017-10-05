import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {IUser} from "../user/UserModel";
import {IApplication} from "../applications/ApplicationModel";

export interface IAuthCode {
	authCode: string,
	expiryDate: Date,
	user: IUser,
	application: IApplication
}

export interface IAuthCodeModel extends IAuthCode, mongoose.Document {
}

const applicationSchema = new mongoose.Schema({
	authCode: String,
	expiryDate: Date,
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	application: {type: Schema.Types.ObjectId, ref: 'Application'}
});

export const AuthCode = mongoose.model<IAuthCodeModel>('AuthCode', applicationSchema);
