import { Sequelize, DataTypes, Model } from "sequelize";

export class TodoItem extends Model {
  id?: number;
  title!: string;
  description?: string;
  isCompleted!: boolean;
  deadline?: Date;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export default function todoItemFactory(sequelize: Sequelize): typeof TodoItem {
  TodoItem.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: new DataTypes.STRING(128),
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
      }
    },
    {
      sequelize,
      tableName: "todos",
      paranoid: true,
      timestamps: true
    }
  );

  return TodoItem;
}
