import Config from "./config";

type ConfigType = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  logging?: boolean;
};

type ConfigTest = {
  dialect: string;
  storage: string;
};

export const development: ConfigType = {
  username: Config.DB.USERNAME,
  password: Config.DB.PASSWORD,
  database: Config.DB.NAME,
  host: Config.DB.HOSTNAME,
  dialect: "mysql"
};

export const production: ConfigType = {
  username: Config.DB.USERNAME,
  password: Config.DB.PASSWORD,
  database: Config.DB.NAME,
  host: Config.DB.HOSTNAME,
  dialect: "mysql",
  logging: false
};

export const test: ConfigTest = {
  dialect: "sqlite",
  storage: ":memory:"
};

export default Config;
