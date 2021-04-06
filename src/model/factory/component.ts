

import { 
    Model,
    Sequelize,
    STRING
} from "sequelize";

/** Component */
interface ComponentAttributes {
    label: string;
}

class Component extends Model<ComponentAttributes> implements ComponentAttributes {
    public label!: string;

    static setRelations(models) {
        Component.hasMany(models.Grade, {as: "grades", foreignKey: "component"});
    }
}

const ComponentSchema = {
    label: {
        type: STRING,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name= "component"): typeof Component {
    Component.init(ComponentSchema, { sequelize, tableName: `${name}s` })

    return Component;
}