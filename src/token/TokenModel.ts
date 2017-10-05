import {IUser} from "../user/UserModel";
import {IApplicationModel} from "../applications/ApplicationModel";
import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IToken {
	accessToken: string,
	accessTokenExpiryDate: Date,
	refreshToken: string,
	refrehsTokenExpiryDate: Date,
	scope: string[],
	application: IApplicationModel,
	user: IUser
}

export interface ITokenModel extends IToken, mongoose.Document {
}

const tokenSchema = new mongoose.Schema({
	accessToken: String,
	accessTokenExpiryDate: Date,
	refreshToken: String,
	refrehsTokenExpiryDate: Date,
	scope: [String],
	application: {type: Schema.Types.ObjectId, ref: 'Application'},
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const Token = mongoose.model<ITokenModel>('Token', tokenSchema);
