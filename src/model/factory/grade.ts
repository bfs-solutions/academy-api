
import { FLOAT, Model, Sequelize } from "sequelize";

/** Grade */
interface GradeAttributes {
    value: number;
}

class Grade extends Model<GradeAttributes> implements GradeAttributes {
    value!: number;
}

const GradeSchema = {
    value: {
        type: FLOAT,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name= "grade"): typeof Grade {
    Grade.init(GradeSchema, { sequelize, tableName: `${name}s` })

    return Grade;
}