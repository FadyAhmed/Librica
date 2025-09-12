import { z } from "zod";

export const logInSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6).max(26),
  }),
});

export type LogInBodySchema = z.infer<typeof logInSchema>['body'];