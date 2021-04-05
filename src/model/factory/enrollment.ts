

import * as sequelize from "sequelize";

/** Enrollment */
interface Enrollment {
    id?: number;
    group?: number;
    student?: number;
    is_repeat: boolean;
    meet_requirements: boolean;
    observations?: string;
}

/** Enrollment instance */
interface EnrollmentInstance extends sequelize.Instance<Enrollment>, Enrollment {}

/** Enrollment model */
interface EnrollmentModel extends sequelize.Model<EnrollmentInstance, Enrollment> {}

const EnrollmentSchema: sequelize.DefineModelAttributes<Enrollment> = {
    is_repeat: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    meet_requirements: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    observations: sequelize.TEXT
};

export default function(sequelize: sequelize.Sequelize, name= "enrollment"): EnrollmentModel {
    let Model = <EnrollmentModel>sequelize.define<EnrollmentInstance, Enrollment>(name, EnrollmentSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.grade, {as: "grades", foreignKey: "enrollment"});
    };

    return Model;
}