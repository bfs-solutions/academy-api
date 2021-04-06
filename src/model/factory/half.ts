

import { 
    Model,
    Sequelize,
    STRING
} from "sequelize";

/** Half */
interface HalfAttributes {
    label: string;
}

class Half extends Model<HalfAttributes> implements HalfAttributes {
    label!: string;

    static setRelations(models) {
        Half.hasMany(models.Partial, {as: "partials", foreignKey: "half"});
    }
}

const HalfSchema = {
    label: {
        type: STRING,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name= "half"): typeof Half {
    Half.init(HalfSchema, { sequelize, tableName: `${name}s` })

    return Half;
}