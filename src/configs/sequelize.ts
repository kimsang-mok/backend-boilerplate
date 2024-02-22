import { Sequelize, QueryTypes } from "sequelize";
import taskFactory, { Task } from "../modules/tasks/task.model";
import taskGroupFactory, { TaskGroup } from "../modules/groups/group.model";
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

/**
 * During testing with an in-memory Sequelize database, I encountered issues where tables
 * were not being initialized properly. To address this, we are currently using a physical test database
 * or a SQLite file for testing purposes. This ensures that the database schema is correctly set up
 * and that the tables are available for use in our tests.
 */

export const syncDB = async () => {
  try {
    if (
      (dbConfig.database.endsWith("test") && dbConfig.dialect !== "sqlite") ||
      (dbConfig.database.endsWith(".sqlite") && dbConfig.dialect === "sqlite")
      // || dbConfig.database === ":memory:"
    ) {
      await sequelize.sync({ force: true });
      /*
      const query =
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";

      const tables = await sequelize.query(query, {
        type: QueryTypes.SELECT
      });
      console.log("Tables in the database:", tables);
      */
    } else {
      await sequelize.sync({ alter: true });
      /*
      const query =
        "SELECT table_name FROM information_schema.tables WHERE table_schema= :dbName";
      const tables = await sequelize.query(query, {
        replacements: { dbName: dbConfig.database },
        type: QueryTypes.SELECT
      });
      console.log("Tables in the database:", tables);
      */
    }
    console.log("DB connection successful");
  } catch (err) {
    console.error("Connection failed", err);
  }
};

export { sequelize };
export default db;
