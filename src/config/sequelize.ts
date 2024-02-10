import { Sequelize } from "sequelize";
import todoItemFactory, { TodoItem } from "../modules/todos/todoItem.model";
import dbConfig from "./database";

export type DB = {
  sequelize: Sequelize;
  TodoItem: typeof TodoItem;
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
  TodoItem: todoItemFactory(sequelize)
};

console.log("Type of todo factory", typeof db.TodoItem);

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
