import { Request, Response, NextFunction } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import httpStatus from "http-status";
import APIError from "@utils/APIError";
import locale from "i18n";

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

// utility function to create APIError instances
const createApiError = (status: number, message: string, errors: any = []) => {
  return new APIError({ status, message, errors });
};

// separate functions for handling specific errors
const handleApiError = (err: any) => err;

const handleExpressValidationError = (err: any) =>
  createApiError(
    httpStatus.UNPROCESSABLE_ENTITY,
    "Data submitted is invalid",
    err.array()
  );

const handleUniqueConstraintError = (err: any) =>
  createApiError(
    httpStatus.CONFLICT,
    "Database error: Unique constraint violation. (Duplicate data)",
    [{ field: err.fields, message: err.message }]
  );

const handleValidationError = (err: any) =>
  createApiError(
    httpStatus.BAD_REQUEST,
    "Database Validation error.",
    err.errors.map((errorItem: any) => ({
      message: errorItem.message,
      type: errorItem.type,
      path: errorItem.path,
      value: errorItem.value
    }))
  );

const handleForeignKeyConstraintError = (err: any) =>
  createApiError(httpStatus.BAD_REQUEST, "Foreign key constraint violation.", [
    {
      message:
        "A referenced entity does not exist or the operation violates the constraint rules.",
      type: "ForeignKeyConstraintError"
    }
  ]);

/**
 * Convert other types of error (ex: db error) into APIerror for consistent response
 */
const converter = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    let convertedError: APIError;

    if (err instanceof APIError) {
      convertedError = handleApiError(err);
    } else if (err.type === "Express Validation Error") {
      convertedError = handleExpressValidationError(err);
    } else if (err instanceof UniqueConstraintError) {
      convertedError = handleUniqueConstraintError(err);
    } else if (err instanceof ValidationError) {
      convertedError = handleValidationError(err);
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      convertedError = handleForeignKeyConstraintError(err);
    } else {
      convertedError = createApiError(
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
        locale.__("Internal server error"),
        [err.message ? { message: err.message } : {}]
      );
    }

    return handler(convertedError, req, res, next);
  };
};

// Not found error middleware
const notFound = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const err = new APIError({
      status: httpStatus.NOT_FOUND,
      message: "Not found",
      errors: []
    });
    return handler(err, req, res, next);
  };
};

export { handler, converter, notFound };
