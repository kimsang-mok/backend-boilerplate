import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
      errors.type = "Express Validation Error";
      return next(errors);
    }
    next();
  };
};
