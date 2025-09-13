import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  ErrorCode,
  ErrorMessage,
  ErrorStatus,
  HttpException,
} from "../exceptions/root";

export const errorMiddleWare = (
  err: HttpException | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    console.log(err);
    
    res.status(ErrorStatus.VALIDATION_ERROR).json({
      message: ErrorMessage.VALIDATION_ERROR,
      errorCode: ErrorCode.VALIDATION_ERROR,
      statusCode: ErrorStatus.VALIDATION_ERROR,
      errors: err.issues,
    });
  }

  // handle api errors
  else if (err instanceof HttpException) {
    const statusCode =
      err instanceof HttpException
        ? err.statusCode
          ? err.statusCode
          : err.statusCode
        : ErrorStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json(<HttpException>{
      message: message,
      errorCode: err.errorCode,
      statusCode: statusCode,
      errors: err.errors,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
};
