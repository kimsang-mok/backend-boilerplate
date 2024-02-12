interface APIErrorConstructorParams {
  status?: number;
  message: string;
  errors?: any;
  isOperational?: boolean;
  stack?: string;
}

class APIError extends Error {
  status: number;
  readonly isOperational: boolean;
  readonly errors: any;

  constructor({
    status = 500,
    message,
    errors,
    isOperational = true,
    stack = ""
  }: APIErrorConstructorParams) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    this.errors = Array.isArray(errors) ? errors : [errors];
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.freeze(this); // make the error object immutable
  }
}

export default APIError;
