import cors from "cors";
import Config from "./config";

export const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: any,
    callback: (arg0: Error, arg1?: boolean) => void
  ) {
    if (Config.CORS.WHITE_LIST.indexOf(origin) !== -1) {
      callback(undefined, true);
    } else {
      callback(new Error("Not Allowed Origin!"));
    }
  }
};
