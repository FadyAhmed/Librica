import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { prismaClient } from "../index";
import { LogInBodySchema } from "../schemas/users.login.schema";
import { SignUpBodySchema } from "../schemas/users.signup.schema";
import { JWT_SECRET } from "../secrets";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async signup(req: Request, res: Response) {
    const { email, password, name } = req.body as SignUpBodySchema;
    let user = await prismaClient.user.findFirst({ where: { email: email } });
    if (user) {
      throw new BadRequestException(
        ErrorMessage.USER_ALREADY_EXISTS,
        ErrorCode.USER_ALREADY_EXISTS
      );
    }
    user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as LogInBodySchema;
    let user = await prismaClient.user.findFirst({ where: { email: email } });
    if (!user) {
      throw new BadRequestException(
        ErrorMessage.USER_NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException(
        ErrorMessage.INCORRECT_PASSWORD,
        ErrorCode.INCORRECT_PASSWORD
      );
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  }
}
