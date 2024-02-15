import express from "express";
import taskController from "./task.controller";
import { createTaskValidator } from "./task.validator";
import validationHandlers from "@middlewares/validationHandlers";

const router = express.Router();

router
  .route("/")
  .get(taskController.getTasks)
  .post(createTaskValidator, validationHandlers(), taskController.createTask);

router.route("/:id").get(taskController.getTaskById);

export default router;
