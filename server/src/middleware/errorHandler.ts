import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/environment.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = "An internal server error occurred.";
  let details: unknown[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_KEY_CONFLICT";
    const field = Object.keys(err.keyValue || {})[0] || "resource";
    message = `An entry with this ${field} already exists.`;
    details = [{ field, issue: "Must be unique" }];
  } else if (err.name === "CastError") {
    statusCode = 400;
    errorCode = "INVALID_ID";
    message = "Invalid identifier format.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
    message = "Invalid authentication token.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
    message = "Session expired. Please log in again.";
  } else {
    // Only log unexpected server errors in development or non-operational cases
    if (env.NODE_ENV !== "test") {
      console.error("Unhandled Server Error:", err);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
