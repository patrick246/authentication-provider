import * as express from 'express';
import * as fs from 'fs';
import * as bunyan from 'bunyan';
import * as path from "path";

const logger = bunyan.createLogger({name: 'RouteConfig'});

function readdir(path: fs.PathLike): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, paths) => {
            if (err)
                return reject(err);
            resolve(paths);
        });
    });
}

function isFile(path: fs.PathLike): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stat) => {
            if (err)
                return reject(err);
            resolve(stat.isFile());
        });
    });
}

function promiseFilter<T>(array: T[], callback: (arg: T) => Promise<boolean>): Promise<T[]> {
    return Promise.all(array.map(callback)).then(result => {
        return array.filter((value, index) => {
            return result[index];
        });
    });
}

module.exports = (app) => {
    const routeDirectory = path.join(__dirname, 'routes');
    console.log(routeDirectory);
    readdir(path.join(__dirname, 'routes'))
        .then(paths => {console.log(paths); return paths;})
        .then(paths => promiseFilter(paths, (routePath: string) => isFile(path.join(__dirname, 'routes', routePath))))
        .then(paths => paths.filter((path: string) => path.endsWith('.ts')))
        .then(paths => paths.forEach(file => {
            logger.info('Loading route handler %s', file);
            let route: (app: express.Application) => void = require.context('./routes', false, /\.ts$/)('./' + file.toString());
            route(app);
        }))
        .catch(reason => {
            logger.fatal('Failed to load routes: ', reason);
        });
};