import 'reflect-metadata';
import * as bunyan from 'bunyan';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import {Application} from 'express';

import {ApplicationContainer} from './util/Injector';
import {interfaces, TYPE, InversifyExpressServer} from 'inversify-express-utils';
import {UserController} from "./routes/UserController";

const logger = bunyan.createLogger({name: 'App'});
async function application() {
    (<any>mongoose).Promise = global.Promise;
    const db = await mongoose.createConnection('mongodb://192.168.99.100/idp');
    logger.info('Connection created');

    ApplicationContainer.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed('UserController');
    let server = new InversifyExpressServer(ApplicationContainer);
    server.setConfig((app: Application) => {
        app.use(bodyParser.json());
    });

    let app = server.build();
    app.listen(3000, () => logger.info('Listening on :3000'));
}

application().then(() => logger.info('Application setup complete')).catch(error => {
    logger.fatal({error: error.message});
});