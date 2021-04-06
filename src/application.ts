
import * as compression from "compression";
import * as express from "express";
import * as passport from "passport";
import * as passportHttp from "passport-http";
import * as sequelize from "sequelize";

import * as model from "./model";
import * as web from "./web";

export class Application {

    public static get DEFAULT_SETTINGS() {
        return {
            sequelize: {
                database: "tsen",
                user: "tsen",
                password: "tsen",
                host: "localhost",
                dialect: "postgres",
                // timezone: "+00:00"
                // logging: false
            },
            express: {
                "trust proxy": true
            },
            models: {
                user: { }
            },
            router: <{[key: string]: web.RouterRule}>{
                /** Router default rule.
                 *
                 * Provide default settings for all the other rules. By default
                 * it just enable all possible operations to be performed over
                 * individual resources and resource collections.
                 */
                "default": { enabled: ["get", "post", "patch", "delete"] },

            }
        };
    }

    private _listener: express.Application;
    private _passport: passport.Passport;
    private _sequelize: sequelize.Sequelize;

    constructor(private _settings: any) {
        this._settings = Object.assign({}, Application.DEFAULT_SETTINGS,
            this._settings);
    }

    public get sequelize(): sequelize.Sequelize {
        // lazy load Sequelize
        if (!this._sequelize) {
            let settings = this._settings.sequelize;
            this._sequelize = new sequelize.Sequelize(settings.database, settings.user,
                settings.password, settings);

            // load all sequelize models
            (new model.Loader(this._settings.loader))
                .load(this._sequelize, this._settings.models);
        }

        return this._sequelize;
    }

    /** Sync database schema on the backend.
     *
     * @param options
     * @returns {Promise<any>}
     */
    public sync(options: sequelize.SyncOptions): PromiseLike<any> {
        return this.sequelize.sync(options);
    }

    private get passport(): passport.Passport {
        // lazy load passport
        if (!this._passport) {
            this._passport = passport;

            // TODO: this need to be customizable
            this._passport.use(new passportHttp.BasicStrategy(
                {}, (<any>this.sequelize.models.User).authenticate()));
        }

        return this._passport;
    }

    /** Web `request` event listener.
     *
     * Express based Web `request` event listener.
     *
     * @returns {express.Application}
     */
    public get listener(): express.Application {
        // lazy load listener
        if (!this._listener) {
            this._listener = express();

            // configure Web `request` event listener
            Object.keys(this._settings.express)
                .forEach(key =>
                    this._listener.set(key, this._settings.express[key])
                );

            this._listener.use(require("express-bunyan-logger")());
            this._listener.use(compression());
            this._listener.use(this.passport.initialize());

            this._listener.use(web.Router(this.sequelize, this.passport, this._settings.router));

            // not found handler
            this._listener.use(web.NotFound);

            // error handler
            // this._listener.use(web.Error);
        }

        return this._listener;
    }
}