

import * as sequelize from "sequelize";

/** Partial */
interface Partial {
    label?: string;
}

/** Partial instance */
interface PartialInstance extends sequelize.Instance<Partial>, Partial {
}

/** Partial model */
interface PartialModel extends sequelize.Model<PartialInstance, Partial> {}

const PartialSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.STRING,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name= "partial"): PartialModel {
    let Model = <PartialModel>sequelize.define<PartialInstance, Partial>(name, PartialSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.component, {as: "components", foreignKey: "partial"});
    };

    return Model;
}