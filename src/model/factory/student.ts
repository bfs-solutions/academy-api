
import { 
    DATE,
    Model,
    Sequelize,
    STRING,
    TEXT
} from "sequelize";

/** Student */
interface StudentAttributes {
    name: string;

    nationality: string;

    phone: string;

    occupation: string;

    work_place: string;

    /* national unique identifier, it is not used as record unique identifier
     because in some countries (for example Ecuador) is not required for
     the student to have the NID in order to register him with the Academic
     Management System of a school.

     See here https://educacion.gob.ec/ministerio-de-educacion-reitera-que-no-es-obligatorio-que-los-estudiantes-presenten-cedulas-de-identidad-en-las-instituciones-educativas/
     */
    nid: string;

    birth_date: Date;

    sex: string;

    birth_place: string;

    father_name: string;

    father_phone: string;

    father_address: string;

    father_profession: string;

    mother_name: string;

    mother_phone: string;

    mother_address: string;

    mother_profession: string;

    legal_guardian_name: string;

    legal_guardian_phone: string;

    legal_guardian_address: string;

    legal_guardian_profession: string;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
    name!: string;

    nationality!: string;

    phone!: string;

    occupation!: string;

    work_place!: string;

    /* national unique identifier, it is not used as record unique identifier
     because in some countries (for example Ecuador) is not required for
     the student to have the NID in order to register him with the Academic
     Management System of a school.

     See here https://educacion.gob.ec/ministerio-de-educacion-reitera-que-no-es-obligatorio-que-los-estudiantes-presenten-cedulas-de-identidad-en-las-instituciones-educativas/
     */
    nid!: string;

    birth_date!: Date;

    sex!: string;

    birth_place!: string;

    father_name!: string;

    father_phone!: string;

    father_address!: string;

    father_profession!: string;

    mother_name!: string;

    mother_phone!: string;

    mother_address!: string;

    mother_profession!: string;

    legal_guardian_name!: string;

    legal_guardian_phone!: string;

    legal_guardian_address!: string;

    legal_guardian_profession!: string;

    static setRelations(models) {
        Student.hasMany(models.Enrollment, {as: "enrollments", foreignKey: "student"});
    }
}

const StudentSchema = {
    name: {
        type: STRING,
        allowNull: false
    },

    nationality: STRING,

    phone: STRING,

    occupation: STRING,

    work_place: TEXT,

    /* national unique identifier, it is not used as record unique identifier
     because in some countries (for example Ecuador) is not required for
     the student to have the NID in order to register him with the Academic
     Management System of a school.

     See here https://educacion.gob.ec/ministerio-de-educacion-reitera-que-no-es-obligatorio-que-los-estudiantes-presenten-cedulas-de-identidad-en-las-instituciones-educativas/
     */
    nid: STRING,

    birth_date: DATE,

    sex: STRING(1),

    birth_place: TEXT,

    father_name: STRING,

    father_phone: STRING,

    father_address: TEXT,

    father_profession: STRING,

    father_email: STRING,

    mother_name: STRING,

    mother_phone: STRING,

    mother_address: TEXT,

    mother_profession: STRING,

    mother_email: STRING,

    legal_guardian_name: STRING,

    legal_guardian_phone: STRING,

    legal_guardian_address: TEXT,

    legal_guardian_profession: STRING,

    legal_guardian_email: STRING,
};

export default function (sequelize: Sequelize, name= "student"): typeof Student {
    Student.init(StudentSchema, { sequelize, tableName: `${name}s` })

    return Student;
}