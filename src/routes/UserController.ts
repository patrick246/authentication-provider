import {Controller} from "../util/Injector";
import {httpGet, httpPost, requestBody} from 'inversify-express-utils';
import {Logger} from "../util/Logger";
import {Request, Response} from 'express';
import {IUser} from "../user/UserModel";
import {UserRepository} from "../user/UserRepository";
import {inject} from 'inversify';

@Controller('/admin/user')
export class UserController {

	@Logger('UserController')
	private logger;

	constructor(@inject(UserRepository) private userRepository: UserRepository) {
	}

	@httpGet('/')
	private async getAllUsers(req: Request, res: Response): Promise<IUser[]> {
		const users = await this.userRepository.getAllUsers();
		return users.map(user => ({
			username: user.username,
			fullname: user.fullname,
			email: user.email
		}));
	}

	@httpPost('/')
	private addUser(@requestBody() body: IUser): Promise<IUser> {
		if (body.username && body.email && body.fullname && body.password) {
			return this.userRepository.addUser(body).then(user => {
				return {
					id: user.id,
					username: user.username,
					fullname: user.fullname,
					email: user.email,
					password: undefined
				}
			});
		}
	}
}