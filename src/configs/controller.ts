import { Request, Response, NextFunction } from "express";
import { DB } from "./sequelize";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default abstract class Controller {
  static catchAsync(
    fn: AsyncRequestHandler
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      fn(req, res, next).catch(next);
    };
  }

  protected sendResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    devMessage: string,
    data: T
  ) {
    res.status(statusCode).json({
      status_code: statusCode,
      message: message,
      dev_message: devMessage,
      data: data
    });
  }

  protected sendErrorResponse(
    res: Response,
    statusCode: number,
    message: string,
    devMessage: string,
    errors: Object[]
  ) {
    res.status(statusCode).json({
      status_code: statusCode,
      message: message,
      dev_message: devMessage,
      data: [],
      errors: errors
    });
  }

  protected ok<T>(res: Response, dto?: T) {
    const data: T | Array<T> = dto || [];
    this.sendResponse(res, 200, "Success", "success", data);
  }

  protected created<T>(res: Response, dto: T) {
    this.sendResponse(res, 201, "Created", "created", dto);
  }

  protected clientError(res: Response, message: string = "Unauthorized") {
    this.sendErrorResponse(res, 400, "Client Error", "client_error", [
      { message }
    ]);
  }

  protected unauthorized(res: Response, message: string = "Unauthorized") {
    this.sendErrorResponse(res, 401, "Unauthorized", "unauthorized", [
      { message }
    ]);
  }

  protected paymentRequired(
    res: Response,
    message: string = "Payment required"
  ) {
    this.sendErrorResponse(res, 402, "Payment Required", "payment_required", [
      { message }
    ]);
  }

  protected forbidden(res: Response, message: string = "Forbidden") {
    this.sendErrorResponse(res, 403, "Forbidden", "forbidden", [{ message }]);
  }

  protected notFound(res: Response, message: string = "Not found") {
    this.sendErrorResponse(res, 404, "Not Found", "not_found", [{ message }]);
  }

  protected conflict(res: Response, message: string = "Conflict") {
    this.sendErrorResponse(res, 409, "Conflict", "conflict", [{ message }]);
  }

  protected tooMany(res: Response, message: string = "Too many requests") {
    this.sendErrorResponse(res, 429, "Too Many Requests", "too_many_requests", [
      { message }
    ]);
  }

  protected todo(res: Response) {
    this.sendErrorResponse(res, 400, "TODO", "todo", [{ message: "TODO" }]);
  }

  protected fail(res: Response, error: Error | string) {
    this.sendErrorResponse(
      res,
      500,
      "Internal Server Error",
      "internal server error",
      [{ message: error.toString() }]
    );
  }

  static getRelationModels(relations: string[], db: DB): any[] | Error {
    const relationModels = [];
    for (let idx = 0; idx < relations.length; idx += 1) {
      if (db[relations[idx]]) {
        relationModels.push(db[relations[idx]]);
      }
    }
    if (relationModels.length <= 0) {
      return new Error(`relation "${relations.join(",")}" not found`);
    }
    return relationModels;
  }
}

/*
protected getRelationModels(relations: string[], db: any): any[] | Error {
  const relationModels = [];
  for (let idx = 0; idx < relations.length; idx += 1) {
    if (db[relations[idx]]) {
      relationModels.push(db[relations[idx]]);
    }
  }
  if (relationModels.length <= 0) {
    return new Error(`relation "${relations.join(",")}" not found`);
  }
  return relationModels;
}
*/
