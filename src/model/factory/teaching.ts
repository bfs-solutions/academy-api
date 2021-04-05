
import * as sequelize from "sequelize";

/** Teaching */
interface Teaching {}

/** Teaching instance */
interface TeachingInstance extends sequelize.Instance<Teaching>, Teaching {}

/** Teaching model */
interface TeachingModel extends sequelize.Model<TeachingInstance, Teaching> {}

const TeachingSchema: sequelize.DefineAttributes = {};

export default function(sequelize: sequelize.Sequelize, name: string = "teaching"): TeachingModel {
    return <TeachingModel>sequelize.define<TeachingInstance, Teaching>(name, TeachingSchema);
}