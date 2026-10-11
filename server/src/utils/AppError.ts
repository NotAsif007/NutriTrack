export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: unknown[];

  constructor(message: string, statusCode = 400, errorCode = "BAD_REQUEST", details: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details: unknown[] = []): AppError {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized access"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden access"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message = "Resource already exists"): AppError {
    return new AppError(message, 409, "CONFLICT");
  }

  static internal(message = "An unexpected error occurred"): AppError {
    return new AppError(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
