import { Sequelize, DataTypes, Model } from "sequelize";

export class Task extends Model {
  id!: number;
  title!: string;
  description?: string;
  isCompleted!: boolean;
  deadline?: Date;
  priorityLevel?: number;
  groupId!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Task {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true
      },
      priorityLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 3
        }
      },
      groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "taskGroups",
          key: "id"
        },
        onDelete: "CASCADE" // enable delete cascading
      }
    },
    {
      sequelize,
      tableName: "tasks",
      indexes: [
        { unique: true, fields: ["title", "groupId"] } // composite unique index
      ],
      paranoid: true,
      timestamps: true
    }
  );

  return Task;
}
