import * as bunyan from 'bunyan';

export function Logger(logName): any {
    return function (target) {
        return {
            value: bunyan.createLogger({name: logName}),
            writable: false,
            enumerable: false,
            configurable: false
        };
    }
}