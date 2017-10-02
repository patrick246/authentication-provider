import {Controller} from "../util/Injector";
import {httpGet, httpPost, requestBody} from "inversify-express-utils";
import {ApplicationCreationSpecification, IApplication} from "../applications/ApplicationModel";
import {ApplicationRepository} from "../applications/ApplicationRepository";
import {inject} from "inversify";

@Controller('/admin/applications')
export class ApplicationController {

	public constructor(@inject(ApplicationRepository) private repository: ApplicationRepository) {
	}

	@httpGet('/')
	public async getAllApplications(): Promise<IApplication[]> {
		return this.repository.getAllApplications();
	}

	@httpPost('/')
	public async createApplication(@requestBody() applicationSpec: ApplicationCreationSpecification): Promise<IApplication> {
		return this.repository.createApplication(applicationSpec);
	}
}