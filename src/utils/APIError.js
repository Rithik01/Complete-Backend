// Now we have defined the error Class let's also define the response Class as well //
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    // Multiple arrays below
    errors = [],
    stack = ""
  ) {
    // Now when you want to overwrite something we call super
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // Production grade below //
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
