
import * as sequelize from "sequelize";

/** Model factory. */
export interface Factory {
    (sequelize: sequelize.Sequelize, settings: any): sequelize.Model<any, any>;
}