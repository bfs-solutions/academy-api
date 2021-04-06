
import * as path from "path";

import * as sequelize from "sequelize";

import * as factory from "./factory";
import * as extension from "./extension";

const requireDir = require("require-dir");

export class Loader {

    private path: string;

    constructor(p?: string) {
        this.path = p || path.resolve(__dirname, "./factory");
    }

    load(sequelize: sequelize.Sequelize, settings: any) {

        const factories: {[name: string]: {"default": factory.Factory}} = requireDir(this.path);

        // load all models
        Object.keys(factories).forEach(name => {
            const Model = factories[name].default(sequelize, settings[name]);

            // apply all model extensions
            extension.FindAllStream(Model);
        });

        // load all model relations
        Object.keys(sequelize.models).forEach(name => {
            if ((<any>sequelize.models[name]).setRelations) {
                (<any>sequelize.models[name]).setRelations(sequelize.models);
            }
        });
    }
}