// test/globalSetup.ts
import { Sequelize } from "sequelize";
import dbConfig from "../src/config/database";

export default async () => {
  const sequelize = new Sequelize("sqlite::memory:");
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // Sync all models
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
