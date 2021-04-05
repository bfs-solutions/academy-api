
import * as sequelize from "sequelize";

/** Group */
interface Group {
    label?: string;
}

/** Group instance */
interface GroupInstance extends sequelize.Instance<Group>, Group {}

/** Group model */
interface GroupModel extends sequelize.Model<GroupInstance, Group> {}

const GroupSchema: sequelize.DefineAttributes = {
    label: {
        type: sequelize.TEXT,
        allowNull: false
    }
};

export default function(sequelize: sequelize.Sequelize, name: string = "group"): GroupModel {
    let Model = <GroupModel>sequelize.define<GroupInstance, Group>(name, GroupSchema);

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.enrollment, {as: "enrollments", foreignKey: "group"});
        Model.hasMany(models.teaching, {as: "teachings", foreignKey: "group"});
    };

    return Model;
}