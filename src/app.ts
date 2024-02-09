import express, { Request, Response } from "express";
import Config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import { morganMiddleware } from "./middlewares/morgan";
import compression from "compression";
import notFoundMiddleware from "./middlewares/notFound";
import todoItemRoute from "./modules/todos/todoItemRoute";

dotenv.config();

const app = express();

app.set("port", Config.PORT);
app.set("env", process.env.NODE_ENV);

// app.use(cors(corsOptions))
app.use(cors());

app.use(morganMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({ name: "Kimsang", age: 21 });
});

app.use("/api/v1/todo", todoItemRoute);

app.use("*", notFoundMiddleware());

export default app;
