

import * as sequelize from "sequelize";

/** Edition */
interface Edition {
    date_start?: Date;
    date_end?: Date;
}

/** Edition instance */
interface EditionInstance extends sequelize.Instance<Edition>, Edition {}

/** Edition model */
interface EditionModel extends sequelize.Model<EditionInstance, Edition> {}

const EditionSchema: sequelize.DefineAttributes = {
    date_start: {
        type: sequelize.DATE,
        defaultValue: sequelize.NOW
    },
    date_end: sequelize.DATE
};

export default function(sequelize: sequelize.Sequelize, name= "edition"): EditionModel {
    let Model = <EditionModel>sequelize.define<EditionInstance, Edition>(name, EditionSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.group, {as: "groups", foreignKey: "edition"});
    };

    return Model;
}