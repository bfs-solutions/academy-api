
import * as express from "express";
import * as passport from "passport";
import * as sequelize from "sequelize";

import { RouterRule } from "./router-rule";
import * as controller from "./controller";

function _setUpRouterParams(router: express.Router,
                            params: {[name: string]: express.RequestParamHandler}) {
    Object.keys(params).forEach(name => router.param(name, params[name]));
}

export function Router(sequelize: sequelize.Sequelize,
                       passport: passport.Passport,
                       rules: {[key: string]: RouterRule}): express.IRouter {

    let router = express.Router();

    // route requests for the root resource
    (new controller.RootResourceController(Object.keys(sequelize.models)))
        .setUpRoute(router.route(`/`));

    // TODO: this need to be customizable
    router.all("*", passport.authenticate("basic", {session: false}));

    // set up routing for all routes
    Object.keys(sequelize.models).forEach(name => {
        const pathName = name.toLowerCase();

        // prepare router rule for this model
        let rule = Object.assign({}, rules["default"], rules[pathName] || {});

        // route requests for model resources
        _setUpRouterParams(
            router,
            (new controller.ResourceController(sequelize.models[name], rule.enabled))
                .setUpRoute(router.route(`/${pathName}s/:${pathName}`)).params
        );

        // route requests for model collection
        (new controller.CollectionController(sequelize.models[name], rule.enabled))
            .setUpRoute(router.route(`/${pathName}s`));

        // route requests for model relations
        Object.keys((<any>sequelize.models[name]).associations).forEach(key => {
            let association = (<any>sequelize.models[name]).associations[key];

            if (association.associationType === "HasMany") {
                // route requests for associated model collection
                (new controller.CollectionController(association.target, rule.enabled))
                    .setUpRoute(router.route(`/${pathName}s/:${pathName}/${key}`));
            }
        });
    });

    return router;
}