import express from "express";
import Config from "./configs";
import dotenv from "dotenv";
import cors from "cors";
import { morganMiddleware } from "./middlewares/morgan";
import compression from "compression";
import "./utils/autobind";
import v1Route from "./route";
import { converter, notFound } from "@middlewares/error";
import localeMiddleware from "@middlewares/locale";
import { syncDB } from "@configs/sequelize";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "test") {
  syncDB();
}

app.set("port", Config.PORT);
app.set("env", process.env.NODE_ENV);
console.log("Environment: ", process.env.NODE_ENV);

// app.use(cors(corsOptions))
app.use(cors());

app.use(morganMiddleware());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(localeMiddleware());

app.use("/docs", express.static("public"));

app.use("/api/v1", v1Route);

app.use(notFound());
app.use(converter());

export default app;
