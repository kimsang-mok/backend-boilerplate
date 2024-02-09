export const catchResponse = (err: ResponseObject | Error): ResponseObject => {
  const res: ResponseObject = {
    status_code: 500,
    message: "Internal server error",
    dev_message: err.message || "internal server error",
    data: []
  };
  if (err instanceof Error) {
    return res;
  }
  return err;
};
