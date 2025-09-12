import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleWare = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof HttpException ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json(<HttpException>{
    message: message,
    errorCode: err.errorCode,
    statusCode: statusCode,
    errors: err.errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
