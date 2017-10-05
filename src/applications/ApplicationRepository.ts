import {Provider} from "../util/Injector";
import {Application, ApplicationCreationSpecification, IApplication} from "./ApplicationModel";
import {UserRepository} from "../user/UserRepository";
import {inject} from "inversify";

import * as crypto from "crypto";
import * as util from "util";

@Provider
export class ApplicationRepository {

	constructor(@inject(UserRepository) private userRepository: UserRepository) {
	}

	public getAllApplications(): Promise<IApplication[]> {
		return Application.find({}).populate('applicationUser', '-password').exec();
	}

	public async createApplication(applicationSpec: ApplicationCreationSpecification): Promise<IApplication> {
		let application = new Application();
		let secret = await util.promisify(crypto.randomBytes)(16)
			.then(bytes => bytes.toString('hex'));
		application.secret = secret;
		application.name = applicationSpec.name;
		application.redirectUri = applicationSpec.redirectUri;

		let username: string = `application:${applicationSpec.name}`;

		let user = await this.userRepository.addUser({
			username,
			password: secret,
			email: '',
			fullname: applicationSpec.name
		});

		application.applicationUser = user;
		application = await application.save();
		console.log(application.id);
		return {
			id: application.id,
			secret: application.secret,
			name: applicationSpec.name,
			redirectUri: applicationSpec.redirectUri,
			applicationUser: {
				id: user.id,
				username: user.username,
				fullname: user.fullname,
				password: secret,
				email: `${applicationSpec.name}@application.idp.patrick246.de`
			}
		}
	}

	public deleteRepository(id: string) {
		return Application.remove({_id: id}).exec();
	}
}