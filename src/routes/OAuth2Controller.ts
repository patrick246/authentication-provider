import * as pug from "pug";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import {httpGet, httpPost, request, requestBody, response, queryParam} from "inversify-express-utils";
import {Controller} from "../util/Injector";
import {Request, Response} from "express";
import {User} from "../user/UserModel";
import {authenticationMiddleware} from "../authentication/AuthenticationMiddleware";
import * as querystring from "querystring";
import {Application} from "../applications/ApplicationModel";
import {Logger} from "../util/Logger";
import {AuthCode} from "../authcode/AuthCodeModel";
import * as util from "util";
const loginTemplate = require("!!raw-loader!../views/login.pug");
const authorizeTemplate = require("!!raw-loader!../views/authorize.pug");

const jwtSecret = process.env.JWT_SECRET || 'secret';

@Controller('/oauth2')
export class OAuth2Controller {

	@Logger('OAuth2Controller')
	private logger;

	@httpGet('/authorize', authenticationMiddleware)
	public async showAuthenticationPage(@response() res: Response, @queryParam('client_id') clientId: string, @request() req: Request) {
		let application = await Application.findOne({_id: clientId}).exec();
		if (!application) {
			this.logger.warn('client_id not found', {client_id: clientId});
			res.status(404).send('client_id not found');
			return;
		}
		res.send(pug.render(authorizeTemplate, {
			application_name: application.name,
			user: (req as any).user,
			query: querystring.stringify(req.query)
		}));
	}

	@httpPost('/authorize', authenticationMiddleware)
	public async authenticate(@request() req: Request, @response() res: Response, @queryParam('client_id') clientId: string, @queryParam('redirect_uri') redirectUri: string) {
		let application = await Application.findOne({_id: clientId}).exec();
		if (!application) {
			throw new Error('client_id not found');
		}
		if (redirectUri !== application.redirectUri) {
			throw new Error('redirect_uri invalid');
		}
		let authCode = new AuthCode({
			authCode: await util.promisify(crypto.randomBytes)(8).then(bytes => bytes.toString('hex')),
			expiryDate: new Date(Date.now() + 1000 * 60 * 10),
			user: (req as any).user._id,
			application: application._id
		});
		await authCode.save();
		res.redirect(redirectUri + '?' + querystring.stringify({
				code: authCode.authCode
			})
		);
	}

	@httpGet('/login')
	public loginForm(@response() res: Response, @request() req: Request) {
		res.send(pug.render(loginTemplate, req.query));
	}

	@httpPost('/login')
	public async login(@requestBody('username') username: string, @requestBody('password') password: string, @response() res: Response, @request() req: Request) {
		console.log(username, password);
		let user = await User.findOne({username}).exec();
		if (user && await bcrypt.compare(password, user.password)) {
			const destinationUrl = `/oauth2/authorize?${querystring.stringify({
				response_type: req.body.response_type,
				client_id: req.body.client_id,
				redirect_uri: req.body.redirect_uri,
				scope: req.body.scope
			})}`;

			res.cookie('identity', jwt.sign({
				username: user.username,
				fullname: user.fullname,
				email: user.email
			}, jwtSecret));
			res.redirect(destinationUrl);
		}
	}

	@httpPost('/logout')
	public logout(@response() res: Response, @request() req: Request) {
		res.clearCookie('identity');
		res.redirect(`/oauth2/login?${querystring.stringify(req.query)}`);
	}
}