
import * as sequelize from "sequelize";

/** Course */
interface Course {
    label?: string;

    promote_to?: number;
}

/** Course instance */
interface CourseInstance extends sequelize.Instance<Course>, Course {}

/** Course model */
interface CourseModel extends sequelize.Model<CourseInstance, Course> {}

const CourseSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.TEXT,
        allowNull: false
    },
    promote_to: sequelize.INTEGER
};

export default function(sequelize: sequelize.Sequelize, name: string = "course"): CourseModel {
    let Model = <CourseModel>sequelize.define<CourseInstance, Course>(name, CourseSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.edition, {as: "editions", foreignKey: "course"});
        Model.hasMany(models.subject, {as: "subjects", foreignKey: "course"});

        Model.hasOne(Model, {as: "promoteTo", foreignKey: "promote_to"});
    };

    return Model;
}