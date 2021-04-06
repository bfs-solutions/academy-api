
import { 
    Model,
    Sequelize,
    TEXT
} from "sequelize";

/** Group */
interface GroupAttributes {
    label: string;
}

class Group extends Model<GroupAttributes> implements GroupAttributes {
    label!: string;

    static setRelations(models) {
        Group.hasMany(models.Enrollment, {as: "enrollments", foreignKey: "group"});
        Group.hasMany(models.Teaching, {as: "teachings", foreignKey: "group"});
    }
}

const GroupSchema = {
    label: {
        type: TEXT,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name: string = "group"): typeof Group {
    Group.init(GroupSchema, { sequelize, tableName: `${name}s` })

    return Group;
}