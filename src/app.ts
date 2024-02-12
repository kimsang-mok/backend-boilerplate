import express, { Request, Response } from "express";
import Config from "./config/config";
import dotenv from "dotenv";
import cors from "cors";
import { morganMiddleware } from "./middlewares/morgan";
import compression from "compression";
import "./utils/autobind";
import v1Route from "./route";
import { converter, notFound } from "@middlewares/error";
import notFoundMiddleware from "./middlewares/notFound";

dotenv.config();

const app = express();

app.set("port", Config.PORT);
app.set("env", process.env.NODE_ENV);
console.log("Environment: ", process.env.NODE_ENV);

// app.use(cors(corsOptions))
app.use(cors());

app.use(morganMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({ name: "Kimsang", age: 21 });
});

app.use("/api/v1", v1Route);

app.use(notFound);
app.use("*", notFoundMiddleware());
app.use(converter);

export default app;
