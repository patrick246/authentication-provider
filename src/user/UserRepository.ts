import {Logger} from "../util/Logger";
import {Provider} from "../util/Injector";
import {IUser, IUserModel, User} from "./UserModel";

@Provider
export class UserRepository {

    @Logger('UserRepository')
    private logger;

    constructor() {
        this.logger.info('UserRepository!');
    }

    public addUser(userData: IUser): Promise<IUserModel> {
        let user = new User(userData);
        return user.save();
    }

    public getAllUsers(): Promise<IUser[]> {
        this.logger.info('GetAllUsers called');
        return User.find({}).exec();
    }
}