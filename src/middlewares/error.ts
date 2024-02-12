import { Request, Response, NextFunction } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import httpStatus from "http-status";
import APIError from "../utils/APIError";

// error handling middleware
const handler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ResponseObject = {
    status_code: err.status,
    message: err.message || httpStatus[err.status],
    dev_message: err.stack || "",
    data: [],
    errors: err.errors ? err.errors : []
  };

  if (process.env.NODE_ENV !== "development") {
    delete response.dev_message;
  }

  res.status(err.status).json(response);
};

/**
 * Convert other types of error (ex: db error) into APIerror for consistent response
 */
const converter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let convertedError: APIError;

  if (err instanceof APIError) {
    convertedError = err;
  } else if (err instanceof UniqueConstraintError) {
    // handle unique constraint error
    convertedError = new APIError({
      status: httpStatus.CONFLICT, // 409 conflict is often used for unique constraint violations
      message: "Database error: Unique constraint violation.(Duplicate data)",
      errors: [{ field: err.fields, message: err.message }]
    });
  } else if (err instanceof ValidationError) {
    // Handle SequelizeValidationError
    convertedError = new APIError({
      status: httpStatus.BAD_REQUEST,
      message: "Validation error.",
      errors: err.errors.map((errorItem) => ({
        message: errorItem.message,
        type: errorItem.type,
        path: errorItem.path,
        value: errorItem.value
      }))
    });
  } else {
    convertedError = new APIError({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
      errors: [err]
    });
  }

  // Multer error
  if (["LIMIT_FILE_SIZE", "LIMIT_UNEXPECTED_FILE"].includes(err.code))
    convertedError.status = httpStatus.BAD_REQUEST;

  return handler(convertedError, req, res, next);
};

// Not found error middleware
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new APIError({
    status: httpStatus.NOT_FOUND,
    message: "Not found"
  });
  return handler(err, req, res, next);
};

export { handler, converter, notFound };
