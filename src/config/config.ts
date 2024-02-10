import * as developmentConfig from "./development.json";
import * as testConfig from "./test.json";
import * as productionConfig from "./production.json";
import dotenv from "dotenv";

dotenv.config();

type ConfigEnvironments = "development" | "test" | "production";

type ConfigType = {
  NODE_ENV: string;
  PORT: string;
  BASE_URL: string;
  DB: {
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
    HOSTNAME: string;
    DIALECT: string;
  };
  CORS: {
    WHITE_LIST: Array<string>;
  };
};

const env = (process.env.NODE_ENV as ConfigEnvironments) || "development";

const configs: { [key in ConfigEnvironments]: ConfigType } = {
  development: developmentConfig,
  test: testConfig,
  production: productionConfig
};

const Config: ConfigType = configs[env];

export default Config;
