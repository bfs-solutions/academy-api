
import { 
    INTEGER,
    Model,
    Sequelize,
    TEXT
} from "sequelize";

/** Course */
interface CourseAttributes {
    label: string;

    promote_to: number;
}

class Course extends Model<CourseAttributes> implements CourseAttributes {
    public label!: string;
    promote_to!: number;

    static setRelations(models) {
        Course.hasMany(models.Edition, {as: "editions", foreignKey: "course"});
        Course.hasMany(models.Subject, {as: "subjects", foreignKey: "course"});

        Course.hasOne(Course, {as: "promoteTo", foreignKey: "promote_to"});
    };
}

const CourseSchema = {
    label: {
        type: TEXT,
        allowNull: false
    },
    promote_to: INTEGER
};

export default function(sequelize: Sequelize, name: string = "course"): typeof Course {
    Course.init(CourseSchema, { sequelize, tableName: `${name}s` })

    return Course;
}