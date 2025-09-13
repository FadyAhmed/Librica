import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../index";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    throw new UnauthorizedException(
      ErrorMessage.Unauthorized,
      ErrorCode.Unauthorized
    );
  }

  try {
    const jwtToken = token.split(" ")[1];
    const payload = jwt.verify(jwtToken, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(
        new UnauthorizedException(
          ErrorMessage.Unauthorized,
          ErrorCode.Unauthorized
        )
      );
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    throw new UnauthorizedException(
      ErrorMessage.Unauthorized,
      ErrorCode.Unauthorized
    );
  }
};

export default authMiddleWare;
