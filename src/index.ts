import "reflect-metadata";
import * as bunyan from "bunyan";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as OAuthServer from "express-oauth-server";

import {Application} from "express";
import {ApplicationContainer} from "./util/Injector";
import {InversifyExpressServer} from "inversify-express-utils";
import {oauth2model} from "./OAuth2Model";
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
        (app as any).oauth = new OAuthServer({
            model: oauth2model
        });
        app.use(bodyParser.json());
        app.use(helmet({
            hsts: false
        }));
        app.all('/authorize', (app as any).oauth.authorize());
        app.all('/token', (app as any).oauth.token());
    });

    let app = server.build();
    app.listen(3000, () => logger.info('Listening on :3000'));
}

application().then(() => logger.info('Application setup complete')).catch(error => {
    logger.fatal({error: error.message});
});