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
  dialect: Config.DB.DIALECT
};

export const production: ConfigType = {
  username: Config.DB.USERNAME,
  password: Config.DB.PASSWORD,
  database: Config.DB.NAME,
  host: Config.DB.HOSTNAME,
  dialect: Config.DB.DIALECT,
  logging: false
};

export const test: ConfigTest = {
  dialect: Config.DB.DIALECT,
  storage: Config.DB.NAME
};

export default Config;
