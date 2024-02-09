type ConfigType = {
  NODE_ENV: string;
  PORT: string;
  BASE_URL: string;
  DB: {
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
    HOSTNAME: string;
  };
  CORS: {
    WHITE_LIST: Array<string>;
  };
};

const env = process.env.NODE_ENV || "development";

const Config: ConfigType =
  env === "development"
    ? require("./development.json")
    : env === "test"
    ? require("./test.json")
    : require("./production.json");

export default Config;
