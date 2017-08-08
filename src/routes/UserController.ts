import {ControllerProvider} from "../util/Injector";
import {injectable} from 'inversify';
import {interfaces, controller, TYPE, httpGet} from 'inversify-express-utils';
import {Logger} from "../util/Logger";
import {Request, Response} from 'express';
import {IUser} from "../user/UserModel";


@injectable()
@controller('/admin/user')
export class UserController implements interfaces.Controller {

    @Logger('UserController')
    private logger;

    @httpGet('/')
    private getAllUsers(req: Request, res: Response): IUser[] {
        return [
            {
                username: 'patrick246',
                fullname: 'Patrick Hahn',
                email: 'patrick@patrick246.de'
            }
        ]
    }
}