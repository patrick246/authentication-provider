import {Logger} from "../util/Logger";
import {Provider} from "../util/Injector";

@Provider(UserRepository)
export class UserRepository
{

    @Logger('UserRepository')
    private logger;

    constructor()
    {
        this.logger.info('User Repository constructed');
    }


}