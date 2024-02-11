import { Model, DataTypes, Sequelize } from "sequelize";
import { Task } from "@modules/tasks/task.model";

export class Group extends Model {
  id!: number;
  name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Group {
  Group.init(
    {
      id: {
        type: DataTypes.NUMBER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "groups",
      paranoid: true,
      timestamps: true
    }
  );

  return Group;
}
