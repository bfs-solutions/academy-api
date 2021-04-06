
import { 
    BOOLEAN,
    Model,
    Sequelize,
    TEXT
} from "sequelize";

/** Subject */
interface SubjectAttributes {
    label: string;
    qualitative: boolean;
}

class Subject extends Model<SubjectAttributes> implements SubjectAttributes {
    label!: string;
    qualitative!: boolean;

    static setRelations(models) {
        Subject.hasMany(models.Half, {as: "halves", foreignKey: "subject"});
        Subject.hasMany(models.Teaching, {as: "teachings", foreignKey: "subject"});
    }
}

const SubjectSchema = {
    label: {
        type: TEXT,
        allowNull: false
    },
    qualitative: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
};

export default function(sequelize: Sequelize, name = "subject"): typeof Subject {
    Subject.init(SubjectSchema, { sequelize, tableName: `${name}s` })

    return Subject;
}