import { z } from "zod";

export const borrowBookSchema = z.object({
  params: z.object({
    bookId: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int()),
  }),
  body: z.object({
    dueDate: z
      .string()
      .transform((val) => (val ? new Date(val) : undefined))
      .pipe(z.date())
      .refine((date) => date > new Date(), {
        message: "Due date must be a future date.",
      }),
  }),
});

export const returnBookSchema = z.object({
  params: z.object({
    bookId: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int()),
  }),
});

export const listBorrowsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive().optional()),
  }),
});

export const deleteBorrowerSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive()),
  }),
});

export type BorrowBookRequestBodySchema = z.infer<typeof borrowBookSchema>;
export type ReturnBookRequestBodySchema = z.infer<typeof returnBookSchema>;
export type ListBorrowsRequestBodySchema = z.infer<typeof listBorrowsSchema>['query'];
export type DeleteBorrowerRequestBodySchema = z.infer<typeof deleteBorrowerSchema>['params'];
