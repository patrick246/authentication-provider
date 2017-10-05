import * as bcrypt from 'bcryptjs';
import {Token} from "./token/TokenModel";
import {Application, IApplicationModel} from "./applications/ApplicationModel";
import {User} from "./user/UserModel";
import {BaseModel} from "oauth2-server";


export const oauth2model = {
	getAccessToken: (token: string) => {
		return Token.findOne({accessToken: token}).lean().exec();
	},
	getRefreshToken: (refreshToken: string) => {
		return Token.findOne({refreshToken}).lean().exec();
	},
	getAuthorizationCode: (authorizationCode: string) => {

	},
	getClient: (clientId: string, clientSecret: string) => {
		console.log(clientId, clientSecret);
		if(clientSecret !== null) {
			return Application.findOne({id: clientId}).populate('applicationUser').lean().exec();
		}
		return Application.findOne({id: clientId, secret: clientSecret}).populate('applicationUser').lean().exec();
	},
	getUser: async (username: string, password: string) => {
		let user = await User.findOne({username}).exec();
		if(user !== null && await bcrypt.compare(password, user.password)) {
			return user;
		}
		return false;
	},
	getUserFromClient: (client: IApplicationModel) => {
		return client.applicationUser;
	},
	saveToken: (token, client, user) => {
		let dbToken = new Token({
			accessToken: token.accessToken,
			accessTokenExpiryDate: new Date(Date.now() + 1000*60*60*24),
			refreshToken: token.refreshToken,
			refreshTokenExpiryDate: new Date(Date.now() + 1000*60*60*24*7),
			application: client._id,
			user: user._id
		});
		return dbToken.save();
	},
	saveAuthorizationCode: (code, client, user) => {

	},
	revokeToken: token => {

	},
	revokeAuthorizationCode: code => {

	},
	verifyScope: (accessToken, scope) => {

	}
};