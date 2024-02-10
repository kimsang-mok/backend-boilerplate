import { Options, Dialect } from "sequelize";
import Config from "./config";

const database: Options = {
  logging: (message) => {
    if (message.startsWith("Executing (default):")) {
      // ignore regular query logs
      return;
    }
    // log anything else (e.g. errors)
    console.error(message);
  },
  username: Config.DB.USERNAME,
  password: Config.DB.PASSWORD,
  database: Config.DB.NAME,
  host: Config.DB.HOSTNAME,
  dialect: Config.DB.DIALECT as Dialect,
  dialectOptions: {
    bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export default database;
