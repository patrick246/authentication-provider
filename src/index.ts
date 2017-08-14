import 'reflect-metadata';
import * as bunyan from 'bunyan';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import {Application} from 'express';

import {ApplicationContainer} from './util/Injector';
import {InversifyExpressServer} from 'inversify-express-utils';
import "./routes/UserController";
import {Connection} from "mongoose";

const logger = bunyan.createLogger({name: 'App'});
async function application() {
    (<any>mongoose).Promise = global.Promise;
    const db = await mongoose.createConnection('mongodb://192.168.99.100/idp');
    ApplicationContainer.bind<Connection>(Connection).toConstantValue(db);
    logger.info('Connection created');

    let server = new InversifyExpressServer(ApplicationContainer);
    server.setConfig((app: Application) => {
        app.use(bodyParser.json());
        app.use(helmet({
            hsts: false
        }));
    });

    let app = server.build();
    app.listen(3000, () => logger.info('Listening on :3000'));
}

application().then(() => logger.info('Application setup complete')).catch(error => {
    logger.fatal({error: error.message});
});