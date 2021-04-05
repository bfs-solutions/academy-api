
import * as sequelize from "sequelize";

/** Student */
interface Student {
    name?: string;

    nationality?: string;

    phone?: string;

    occupation?: string;

    work_place?: string;

    /* national unique identifier, it is not used as record unique identifier
     because in some countries (for example Ecuador) is not required for
     the student to have the NID in order to register him with the Academic
     Management System of a school.

     See here https://educacion.gob.ec/ministerio-de-educacion-reitera-que-no-es-obligatorio-que-los-estudiantes-presenten-cedulas-de-identidad-en-las-instituciones-educativas/
     */
    nid?: string;

    birth_date?: Date;

    sex?: string;

    birth_place?: string;

    father_name?: string;

    father_phone?: string;

    father_address?: string;

    father_profession?: string;

    mother_name?: string;

    mother_phone?: string;

    mother_address?: string;

    mother_profession?: string;

    legal_guardian_name?: string;

    legal_guardian_phone?: string;

    legal_guardian_address?: string;

    legal_guardian_profession?: string;
}

/** Student instance */
interface StudentInstance extends sequelize.Instance<Student>, Student {}

interface StudentModel extends sequelize.Model<StudentInstance, Student> {
    findAllStream(options): NodeJS.ReadableStream;
}

const StudentSchema: sequelize.DefineAttributes = {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },

    nationality: sequelize.STRING,

    phone: sequelize.STRING,

    occupation: sequelize.STRING,

    work_place: sequelize.TEXT,

    /* national unique identifier, it is not used as record unique identifier
     because in some countries (for example Ecuador) is not required for
     the student to have the NID in order to register him with the Academic
     Management System of a school.

     See here https://educacion.gob.ec/ministerio-de-educacion-reitera-que-no-es-obligatorio-que-los-estudiantes-presenten-cedulas-de-identidad-en-las-instituciones-educativas/
     */
    nid: sequelize.STRING,

    birth_date: sequelize.DATE,

    sex: sequelize.STRING(1),

    birth_place: sequelize.TEXT,

    father_name: sequelize.STRING,

    father_phone: sequelize.STRING,

    father_address: sequelize.TEXT,

    father_profession: sequelize.STRING,

    father_email: sequelize.STRING,

    mother_name: sequelize.STRING,

    mother_phone: sequelize.STRING,

    mother_address: sequelize.TEXT,

    mother_profession: sequelize.STRING,

    mother_email: sequelize.STRING,

    legal_guardian_name: sequelize.STRING,

    legal_guardian_phone: sequelize.STRING,

    legal_guardian_address: sequelize.TEXT,

    legal_guardian_profession: sequelize.STRING,

    legal_guardian_email: sequelize.STRING,
};

export default function (sequelize: sequelize.Sequelize, name= "student"): StudentModel {
    let Model = <StudentModel>sequelize.define<StudentInstance, Student>(name, StudentSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.enrollment, {as: "enrollments", foreignKey: "student"});
    };

    return Model;
}