
import { Model, Sequelize } from "sequelize";

/** Teaching */
interface TeachingAttributes {}

class Teaching extends Model<TeachingAttributes> implements TeachingAttributes {}

export default function(sequelize: Sequelize, name: string = "teaching"): typeof Teaching {
    Teaching.init({}, { sequelize, tableName: `${name}s` })

    return Teaching;
}