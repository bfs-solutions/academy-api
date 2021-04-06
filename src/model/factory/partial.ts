
import { 
    Model,
    Sequelize,
    STRING
} from "sequelize";

/** Partial */
interface PartialAttributes {
    label: string;
}

class Partial extends Model<PartialAttributes> implements PartialAttributes {
    label!: string;

    static setRelations(models) {
        Partial.hasMany(models.Component, {as: "components", foreignKey: "partial"});
    }
}

const PartialSchema = {
    label: {
        type: STRING,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name= "partial"): typeof Partial {
    Partial.init(PartialSchema, { sequelize, tableName: `${name}s` })

    return Partial;
}