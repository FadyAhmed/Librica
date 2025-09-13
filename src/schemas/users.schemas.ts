import { z } from "zod";

export const logInSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6).max(26),
  }),
});

export const signUpSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(26),
  }),
});

export type SignUpBodySchema = z.infer<typeof signUpSchema>['body'];

export type LogInBodySchema = z.infer<typeof logInSchema>['body'];