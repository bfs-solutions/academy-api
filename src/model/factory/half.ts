

import * as sequelize from "sequelize";

/** Half */
interface Half {
    label?: string;
}

/** Half instance */
interface HalfInstance extends sequelize.Instance<Half>, Half {
}

/** Half model */
interface HalfModel extends sequelize.Model<HalfInstance, Half> {}

const HalfSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.STRING,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name= "half"): HalfModel {
    let Model = <HalfModel>sequelize.define<HalfInstance, Half>(name, HalfSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.partial, {as: "partials", foreignKey: "half"});
    };

    return Model;
}