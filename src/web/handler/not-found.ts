
import * as express from "express";

export function NotFound(req, res, next: express.NextFunction) {
    const error = new Error("Not Found");

    // set status attribute for status aware error handling middleware
    (<any>error).status = 404;

    return next(error);
}