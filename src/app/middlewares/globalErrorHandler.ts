/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";
import AppError from "../error/AppError";
import { duplicateError } from "../helpers/handleDuplicateError";
import { validationError } from "../helpers/handleValidationError";
import { zodError } from "../helpers/handleZodError";
import { castError } from "../helpers/handleCastError";
import { IErrorResources } from "../interfaces/error.types";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: IErrorResources[] = [];

  // Duplicate Error
  if (err.code === 11000) {
    const simplifiedError = duplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = validationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorResources[];
  }
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = zodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorResources[];
  }
  // Cast Erro
  else if (err.name === "CastError") {
    const simplifiedError = castError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Custom Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Error from Custom JS Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: envVariables.NODE_ENV === "development" ? err.stack : null,
  });
};
