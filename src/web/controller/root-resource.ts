
import * as express from "express";

const jsonstream = require("JSONStream");

import * as transform from "../transform";
import * as controller from "./controller";

export class RootResourceController implements controller.Controller {

    constructor(protected models: Array<string>) {}

    public setUpRoute(route) {

        route.get(RootResourceController.redirectBrowserToUiClient, this.get.bind(this));

        return this;
    }

    static redirectBrowserToUiClient(req: express.Request, res: express.Response, next: Function) {
        if (req.accepts(["text/html"])) { res.redirect("/academy"); res.end(); }
        else { next(); }
    }

    protected get(req: express.Request, res: express.Response, next: express.NextFunction) {
        // perform basic content negotiation check to avoid invoke de backend
        // unnecessary
        if (!req.accepts(["application/hal+json"])) {
            const error = new Error("Not Acceptable");

            // set status attribute for status aware error handling middleware
            (<any>error).status = 406;

            return next(error);
        }

        let outStream, inStream = new transform.HALLinkProvider({
            relation: "self",
            operator: () => req.originalUrl
        });

        outStream = inStream;


        // provide a link to each relation
        this.models.forEach(name => {
            outStream = outStream.pipe(new transform.HALLinkProvider({
                relation: `has-${name}s`,
                operator: () => `/${name}s`
            }));
        });

        res.format({
            "application/hal+json": () => {
                outStream
                    .pipe(jsonstream.stringify("", "", ""))
                    .pipe(res);

                inStream.write({});
                inStream.end();
            }
        });
    }
}