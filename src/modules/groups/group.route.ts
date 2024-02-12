import express from "express";
import groupController from "./group.controller";

const router = express.Router();

router
  .route("/")
  .get(groupController.getGroups)
  .post(groupController.createGroup);

router.route("/:id").get(groupController.getGroupById).patch(groupController.updateGroup);

export default router;
