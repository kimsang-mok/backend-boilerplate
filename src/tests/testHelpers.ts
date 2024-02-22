import { sequelize } from "../configs/sequelize";

export const clearDatabase = async () => {
  return Promise.all(
    Object.keys(sequelize.models).map((key) => {
      return sequelize.models[key].destroy({ where: {}, force: true });
    })
  );
};

export const clearDatabaseBeforeEach = () => {
  beforeEach(async () => {
    await clearDatabase();
  });
};
