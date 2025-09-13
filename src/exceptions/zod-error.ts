import { ZodError } from "zod";

export class CustomZodError extends ZodError {
  constructor(errors: any) {
    super(errors.issues);
  }
}
