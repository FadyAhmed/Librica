import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(26),
  }),
});

export type SignUpBodySchema = z.infer<typeof signUpSchema>['body'];