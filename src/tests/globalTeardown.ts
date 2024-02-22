import { sequelize } from "../configs/sequelize";

export default async () => {
  try {
    await sequelize.close();
    console.log("DB connection successfully closed.");
  } catch (err) {
    console.error("Fail to close DB connections", err);
  }
};
