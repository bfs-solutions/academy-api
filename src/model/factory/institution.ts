
import * as sequelize from "sequelize";

import * as enrollment from "./enrollment";

/** Institution */
interface Institution {
    name?: string;
    province?: string;
    canton?: string;
    parish?: string;
    type?: string;
}

/** Institution instance */
interface InstitutionInstance extends sequelize.Instance<Institution>, Institution {}

/** Course model */
export interface InstitutionModel extends sequelize.Model<InstitutionInstance, Institution> {}

const InstitutionSchema: sequelize.DefineAttributes = {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    province: {
        type: sequelize.STRING,
        allowNull: false
    },
    canton: {
        type: sequelize.STRING,
        allowNull: false
    },
    parish: {
        type: sequelize.STRING,
        allowNull: false
    },
    type: {
        type: sequelize.STRING,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name= "institution"): InstitutionModel {
    let Model =  <InstitutionModel>sequelize.define<InstitutionInstance, Institution>(name, InstitutionSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.enrollment, {as: "enrollments", foreignKey: "institution"});
    };

    return Model;
}