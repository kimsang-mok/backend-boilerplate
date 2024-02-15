import { check } from "express-validator";

export const createGroupValidator = [
    check("name")
    .not()
    .isEmpty()
    .withMessage("Group name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Group name must have at least 3 characters long.")
];
