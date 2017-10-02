import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser {
	id?: string,
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

userSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password'))
		return next();

	const salt = await bcrypt.genSalt(13);
	user.password = await bcrypt.hash(user.password, salt);
	next();
});

userSchema.methods.comparePassword = async function (password, callback) {
	return callback(null, await bcrypt.compare(password, this.password))
};

export const User = mongoose.model<IUserModel>('User', userSchema);