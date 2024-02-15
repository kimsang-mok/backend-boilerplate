import { check } from "express-validator";

export const createTaskValidator = [
  check("title")
    .not()
    .isEmpty()
    .withMessage("Task title cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Title must have at least 3 characters long."),
  check("groupId")
    .not()
    .isEmpty()
    .withMessage("Task must correspond to a group")
    .isInt()
    .withMessage("Group id must be an integer.")
];
