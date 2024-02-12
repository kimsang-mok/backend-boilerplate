import express from "express";
import taskController from "./task.controller";

const router = express.Router();

router.route("/").get(taskController.getTasks).post(taskController.createTask);

router.route("/:id").get(taskController.getTaskById);

export default router;
