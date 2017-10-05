import * as jwt from "jsonwebtoken";
import * as util from "util";
import * as bunyan from "bunyan";

import {Request, Response} from "express";
import * as querystring from "querystring";

const jwtSecret = process.env.JWT_SECRET || 'secret';
const logger = bunyan.createLogger({name: 'Authentication Middleware'});

export async function authenticationMiddleware(req: Request, res: Response, next: Function) {
	if("identity" in req.cookies) {
		try {
			(req as any).user = await util.promisify(jwt.verify)(req.cookies.identity, jwtSecret);
			next();
			return;
		} catch(err) {
			logger.warn('Authentication Error', {error: err});
		}
	}
	res.redirect(`/oauth2/login?${querystring.stringify(req.query)}`);
	return;
}