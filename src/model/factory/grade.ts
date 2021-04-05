
import * as sequelize from "sequelize";

/** Grade */
interface Grade {
    value?: number;
}

/** Grade instance */
interface GradeInstance extends sequelize.Instance<Grade>, Grade {}

interface GradeModel extends sequelize.Model<GradeInstance, Grade> {}

const GradeSchema: sequelize.DefineAttributes = {
    value: {
        type: sequelize.FLOAT,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name= "grade"): GradeModel {
    return <GradeModel>sequelize.define<GradeInstance, Grade>(name, GradeSchema);
}