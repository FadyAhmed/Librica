import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { CustomZodError } from "../exceptions/zod-error";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      throw new CustomZodError(err);
    }
  };
