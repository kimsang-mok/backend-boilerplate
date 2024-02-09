import { Sequelize } from "sequelize";
import todoItemFactory, { TodoItem } from "../modules/todos/todoItemModel";
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
}

const db: DB = {
  sequelize,
  TodoItem: todoItemFactory(sequelize)
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(" DB connection successful");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });

export default db;
