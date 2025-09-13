import { NextFunction, Request, Response } from "express";
import { ErrorCode, ErrorMessage } from "../../exceptions/root";
import { UnauthorizedException } from "../../exceptions/unauthorized";

const adminRoleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    throw new UnauthorizedException(
      ErrorMessage.NOT_AN_ADMIN,
      ErrorCode.NOT_AN_ADMIN
    );
  }
};

export default adminRoleMiddleware;
