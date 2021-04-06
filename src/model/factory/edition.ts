
import { 
    DATE,
    Model,
    NOW,
    Sequelize
} from "sequelize";

/** Edition */
interface EditionAttributes {
    date_start: Date;
    date_end: Date;
}

class Edition extends Model<EditionAttributes> implements EditionAttributes {
    date_start!: Date;
    date_end!: Date;

    static setRelations(models) {
        Edition.hasMany(models.Group, {as: "groups", foreignKey: "edition"});
    }
}

const EditionSchema = {
    date_start: {
        type: DATE,
        defaultValue: NOW
    },
    date_end: DATE
};

export default function(sequelize: Sequelize, name= "edition"): typeof Edition {
    Edition.init(EditionSchema, { sequelize, tableName: `${name}s` })

    return Edition;
}