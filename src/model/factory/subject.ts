
import * as sequelize from "sequelize";

/** Subject */
interface Subject {
    label?: string;
    qualitative?: boolean;
}

/** Subject instance */
interface SubjectInstance extends sequelize.Instance<Subject>, Subject {}

/** Subject model */
interface SubjectModel extends sequelize.Model<SubjectInstance, Subject> {}

const SubjectSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.TEXT,
        allowNull: false
    },
    qualitative: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
};

export default function(sequelize: sequelize.Sequelize, name: string = "subject"): SubjectModel {
    let Model = <SubjectModel>sequelize.define<SubjectInstance, Subject>(name, SubjectSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.half, {as: "halves", foreignKey: "subject"});
        Model.hasMany(models.teaching, {as: "teachings", foreignKey: "subject"});
    };

    return Model;
}