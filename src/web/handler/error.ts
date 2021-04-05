
import * as express from "express";

export function Error(err, req, res: express.Response, next) {
    res.status((<any>err).status || 500).type("json");

    res.write(JSON.stringify(err, replaceErrors));
    res.end();
}

function replaceErrors(key, value) {
    if (value instanceof Error) {
        let error = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}