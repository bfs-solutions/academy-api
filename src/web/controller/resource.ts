
import * as express from "express";
import {json} from "body-parser";
import * as sequelize from "sequelize";

const jsonstream = require("JSONStream");

import * as patch from "../patch";
import * as transform from "../transform";
import { Method } from "../router-rule";

import * as controller from "./controller";

export class ResourceController implements controller.Controller {

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

        if (this.methods.indexOf("patch") !== -1) {
            route.patch(json({type: "application/json-patch+json"}), this.patch.bind(this));
        }

        if (this.methods.indexOf("delete") !== -1) {
            route.delete(this.delete_.bind(this));
        }

        return this;
    }

    /** Mapping of route parameter handlers provided by the controller.
     *
     * @see controller.Controller.params
     */
    public get params () {
        const params = {};

        params[this.name] = this.item.bind(this);

        return params;
    }

    /** Route parameter handler for resource.
     *
     * @see express.RequestParamHandler
     */
    protected item(req: express.Request, res: express.Response,
                   next: express.NextFunction, id: string) {

        this.model.findByPk(id).then((instance) => {
                if (!instance) {
                    const error = new Error("Not Found");

                    // set status attribute for status aware error handling middleware
                    (<any>error).status = 404;

                    return next(error);
                }

                (<any>req)[this.name] = instance;

                next();
            }, (err) => next(err)
        );
    }

    protected resource(req: express.Request): sequelize.Model<any> {
        return (<any>req)[this.name];
    }

    protected get(req: express.Request, res: express.Response,
                  next: express.NextFunction) {

        // perform basic content negotiation check to avoid invoke de backend
        // unnecessary
        if (!req.accepts(["application/hal+json"])) {
            const error = new Error("Not Acceptable");

            // set status attribute for status aware error handling middleware
            (<any>error).status = 406;

            return next(error);
        }

        let outStream, inStream = new transform.InstanceToJson();

        outStream = inStream
            .pipe(new transform.HALLinkProvider({
                relation: "self",
                operator: (instance) => `/${this.name}s/${instance[this.model.primaryKeyAttributes[0]]}`
            }));


        // provide a link to each relation
        Object.keys((<any>this.model).associations).forEach(name => {
            const association = (<any>this.model).associations[name];

            if (association.associationType === "HasMany") {
                outStream = outStream.pipe(new transform.HALLinkProvider({
                    relation: `${this.name}-has-${name}`,
                    operator: (instance) => `/${this.name}s/${instance[this.model.primaryKeyAttributes[0]]}/${name}`
                }));
            }
        });

        res.format({
            "application/hal+json": () => {
                outStream
                    .pipe(jsonstream.stringify("", "", ""))
                    .pipe(res);

                inStream.write(this.resource(req));
                inStream.end();
            }
        });
    }

    protected patch(req: express.Request, res: express.Response,
                    next: express.NextFunction) {

        // perform basic content negotiation check to avoid invoke de backend
        // unnecessary
        if (!req.is("application/json-patch+json")) {
            const error = new Error("Unsupported Media Type");

            // set status attribute for status aware error handling middleware
            (<any>error).status = 415;

            return next(error);
        }

        let values = {},
            error = null;

        for (let i = 0; i < (<Array<patch.Patch>>req.body).length; i++) {
            const patch = (<Array<patch.Patch>>req.body)[i],
                attr = patch.path.split("/").pop();
            switch (patch.op) {
                case "replace":
                    values[attr] = patch.value;
                    break;
                default:
                    error = new Error(`Operation with index ${i} and name \
                                 ${patch.op} not supported`);
                    break;
            }
            if (error) { return Promise.reject(error); }
        }

        this.resource(req).update(values).then(
            () => res.end(), (err) => { err.status = 422; next(err); }
        );
    }

    protected delete_(req: express.Request, res: express.Response,
                      next: express.NextFunction) {

        this.resource(req).destroy().then(
            () => res.end(), (err) => { next(err); }
        );
    }
}