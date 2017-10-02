import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {IUser} from "../user/UserModel";

export interface IApplication {
	id?: string,
	name: string,
	secret: string,
	applicationUser: IUser
}

export interface ApplicationCreationSpecification {
	name: string
}

export interface IApplicationModel extends IApplication, mongoose.Document {
}

const applicationSchema = new mongoose.Schema({
	id: String,
	name: String,
	secret: String,
	applicationUser: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const Application = mongoose.model<IApplicationModel>('Application', applicationSchema);
