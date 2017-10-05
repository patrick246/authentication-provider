import "reflect-metadata";
import * as bunyan from "bunyan";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cookieParser from 'cookie-parser';

import {Application} from "express";
import {ApplicationContainer} from "./util/Injector";
import {InversifyExpressServer} from "inversify-express-utils";
import "./routes";

const logger = bunyan.createLogger({name: 'App'});
mongoose.set('debug', (coll, method, query, doc) => logger.info('mongoose query', {coll, method, query, doc}));

process.on('unhandledRejection', err => {
    console.log(err);
    console.log(err.stack);
});

async function application() {
    (<any>mongoose).Promise = global.Promise;
    await mongoose.connect('mongodb://192.168.99.100/idp', {
        useMongoClient: true
    });
    logger.info('Connection created');

    let server = new InversifyExpressServer(ApplicationContainer);
    server.setConfig((app: Application) => {
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
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