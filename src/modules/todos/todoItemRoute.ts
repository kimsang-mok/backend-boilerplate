import express, { Request, Response } from "express";
import todoItemController from "./todoItemController";

const router = express.Router();

router
  .route("/")
  .get(todoItemController.getTodoItemList)
  .post(todoItemController.createTodoItem);

export default router;
