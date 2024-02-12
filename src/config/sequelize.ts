import { Sequelize } from "sequelize";
import taskFactory, { Task } from "@modules/tasks/task.model";
import taskGroupFactory, { TaskGroup } from "@modules/groups/group.model";
import dbConfig from "./database";

export type DB = {
  sequelize: Sequelize;
  Task: typeof Task;
  TaskGroup: typeof TaskGroup;
  [key: string]: any;
};

// connection to the database
let sequelize: Sequelize;
if (dbConfig.database && dbConfig.username) {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
} else {
  sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.database
  });
}

const db: DB = {
  sequelize,
  Task: taskFactory(sequelize),
  TaskGroup: taskGroupFactory(sequelize)
};

/**
 * Define associations in the database setup file, rather than directly within model files:
 * 1. Single source of truth for how models relate to each other (Centralized Management)
 * 2. Avoid circular dependencies (two or more models depend on each other)
 */

// establish one-to-many relationship between Group and Task
db.Task.belongsTo(db.TaskGroup, { foreignKey: "groupId", as: "taskGroup" });
db.TaskGroup.hasMany(db.Task, { foreignKey: "groupId", as: "tasks" });

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("DB connection successful");
  } catch (err) {
    console.log("Connection failed");
    console.log(err);
  }
};

syncDB();

export default db;
