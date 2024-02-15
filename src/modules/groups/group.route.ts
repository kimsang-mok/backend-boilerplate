import express from "express";
import groupController from "./group.controller";
import validationHandlers from "@middlewares/validationHandlers";
import { createGroupValidator } from "./group.validator";

const router = express.Router();

router
  .route("/")
  .get(groupController.getGroups)
  .post(
    createGroupValidator,
    validationHandlers(),
    groupController.createGroup
  );

router
  .route("/:id")
  .get(groupController.getGroupById)
  .patch(groupController.updateGroup);

export default router;
