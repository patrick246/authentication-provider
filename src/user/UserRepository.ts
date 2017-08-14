import {Logger} from "../util/Logger";
import {Provider} from "../util/Injector";
import {Connection} from "mongoose";
import {inject} from 'inversify';
import {IUser, IUserModel, User} from "./UserModel";

@Provider
export class UserRepository {

    @Logger('UserRepository')
    private logger;

    constructor(@inject(Connection) private connection: Connection) {
        this.logger.info('UserRepository!');
    }

    public addUser(userData: IUser): Promise<IUserModel> {
        let user = new User(userData);
        return user.save();
    }

    public getAllUsers(): Promise<IUserModel[]> {
        this.logger.info('GetAllUsers called');
        return User.find({}).exec();
    }
}