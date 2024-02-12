import { Model, DataTypes, Sequelize } from "sequelize";

export class TaskGroup extends Model {
  id!: number;
  name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TaskGroup {
  TaskGroup.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      tableName: "taskGroups",
      indexes: [{ unique: true, fields: ["name"] }],
      paranoid: true,
      timestamps: true
    }
  );

  return TaskGroup;
}
