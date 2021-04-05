

import * as sequelize from "sequelize";

/** Component */
interface Component {
    label?: string;
}

/** Component instance */
interface ComponentInstance extends sequelize.Instance<Component>, Component {
}

/** Component model */
interface ComponentModel extends sequelize.Model<ComponentInstance, Component> {
    findAllStream(options): NodeJS.ReadableStream;
}

const ComponentSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.STRING,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name= "component"): ComponentModel {
    let Model = <ComponentModel>sequelize.define<ComponentInstance, Component>(name, ComponentSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.grade, {as: "grades", foreignKey: "component"});
    };

    return Model;
}