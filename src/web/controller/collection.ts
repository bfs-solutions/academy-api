
import * as express from "express";
import {json} from "body-parser";
import * as sequelize from "sequelize";

const jsonstream = require("JSONStream");

import * as transform from "../transform";
import * as utils from "../utils";
import { Method } from "../router-rule";

import * as controller from "./controller";

export class CollectionController implements controller.Controller {

    /** Resource name.
     */
    private name: string;

    constructor(private model: sequelize.ModelCtor<any>, private methods: Array<Method>) {

        this.name = (<any>this.model).name.toLowerCase();
    }

    /** Set up an Express route
     *
     * @see controller.Controller.setUpRoute
     */
    public setUpRoute(route) {

        if (this.methods.indexOf("get") !== -1) {
            route.get(this.get.bind(this));
        }

        if (this.methods.indexOf("post") !== -1) {
            route.post(json(), this.post.bind(this));
        }

        return this;
    }

    get(req: express.Request, res: express.Response, next: express.NextFunction) {
        // perform basic content negotiation check to avoid invoke de backend
        // unnecessary
        if (!req.accepts(["application/hal+json"])) {
            const error = new Error("Not Acceptable");

            // set status attribute for status aware error handling middleware
            (<any>error).status = 406;

            return next(error);
        }

        // pre-process input parameters before passing them to the store API
        let start = parseInt(req.query.start as unknown as string) || 0;
        let items = parseInt(req.query.items as unknown as string) || Infinity;
        let links: any = { self: { href: req.originalUrl } };

        // provide a prev link if not at the start
        if (start > 0) {
            let prevStart = start - items >= 0 ? start - items : 0;
            let prevItems = start - items >= 0 ? items : start - prevStart;
            links.prev = {
                href: utils.makeUpdatedUrl(req.originalUrl, {
                    start: prevStart,
                    items: prevItems
                })
            };
        }
        // provide a next link if pagination requested
        if (items !== Infinity) {
            let nextStart = start + items;
            links.next = {
                href: utils.makeUpdatedUrl(req.originalUrl, {
                    start: nextStart,
                    items: items
                })
            };
        }

        let options: any = Object.assign(
            {}, { offset: start, limit: items }, { where: req.params });

        let instanceStream = (<any>this.model).findAllStream(options)
            .pipe(new transform.InstanceToJson())
            .pipe(new transform.HALLinkProvider({
                relation: "self",
                operator: (instance) => `/${this.name}s/${instance[this.model.primaryKeyAttributes[0]]}`
            }));

        // provide a link to each relation
        Object.keys((<any>this.model).associations).forEach(name => {
            let association = (<any>this.model).associations[name];

            if (association.associationType === "HasMany") {
                instanceStream = instanceStream.pipe(new transform.HALLinkProvider({
                    relation: `${this.name}-has-${name}`,
                    operator: (instance) => `/${this.name}s/${instance[this.model.primaryKeyAttributes[0]]}/${name}`
                }));
            }
        });

        res.format({
            "application/hal+json": () =>
                instanceStream.pipe(jsonstream.stringify(
                    `{"_links":${JSON.stringify(links)}, "_embedded": {"${this.name}s":[\n`,
                    ",\n",
                    "\n]}}\n"
                )).pipe(res)
        });

    }

    post(request: express.Request, response: express.Response, next: Function) {
        // perform basic content negotiation check to avoid invoke de backend
        // unnecessary
        if (!request.is("application/json")) {
            const error = new Error("Unsupported Media Type");

            // set status attribute for status aware error handling middleware
            (<any>error).status = 415;

            return next(error);
        }

        // move params into request body for persistence
        request.body = Object.assign({}, request.body, request.params);

        this.model.create(request.body)
            .then(
                (instance) => response.status(201)
                    .location(`/${this.name}s/${instance.get("id")}`).end(),
                (err) => next(err)
            );
    }
}