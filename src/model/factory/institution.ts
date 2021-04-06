
import { 
    Model,
    Sequelize,
    STRING,
    TEXT
} from "sequelize";

/** Institution */
interface InstitutionAttributes {
    name: string;
    province: string;
    canton: string;
    parish: string;
    type: string;
}

class Institution extends Model<InstitutionAttributes> implements InstitutionAttributes {
    name!: string;
    province!: string;
    canton!: string;
    parish!: string;
    type!: string;

    static setRelations(models) {
        Institution.hasMany(models.Enrollment, {as: "enrollments", foreignKey: "institution"});
    }
}

const InstitutionSchema = {
    name: {
        type: STRING,
        allowNull: false
    },
    province: {
        type: STRING,
        allowNull: false
    },
    canton: {
        type: STRING,
        allowNull: false
    },
    parish: {
        type: STRING,
        allowNull: false
    },
    type: {
        type: STRING,
        allowNull: false
    }
};

export default function(sequelize: Sequelize, name= "institution"): typeof Institution {
    Institution.init(InstitutionSchema, { sequelize, tableName: `${name}s` })

    return Institution;
}