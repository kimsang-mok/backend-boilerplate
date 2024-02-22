import { syncDB } from "../configs/sequelize";

export default async () => {
  await syncDB();
};
