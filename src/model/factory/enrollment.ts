

import { 
    BOOLEAN,
    Model,
    Sequelize,
    TEXT
} from "sequelize";

/** Enrollment */
interface EnrollmentAttributes {
    // id: number;
    // group: number;
    // student: number;
    is_repeat: boolean;
    meet_requirements: boolean;
    observations: string;
}

class Enrollment extends Model<EnrollmentAttributes> implements EnrollmentAttributes {
    // id!: number;
    // group!: number;
    // student!: number;
    is_repeat!: boolean;
    meet_requirements!: boolean;
    observations!: string;

    static setRelations(models) {
        Enrollment.hasMany(models.Grade, {as: "grades", foreignKey: "enrollment"});
    }
}

const EnrollmentSchema = {
    is_repeat: {
        type: BOOLEAN,
        allowNull: false
    },
    meet_requirements: {
        type: BOOLEAN,
        allowNull: false
    },
    observations: TEXT
};

export default function(sequelize: Sequelize, name= "enrollment"): typeof Enrollment {
    Enrollment.init(EnrollmentSchema, { sequelize, tableName: `${name}s` })

    return Enrollment;
}