import { z } from "zod";

export const createBookSchema = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string(),
    quantity: z.number(),
    shelfLocation: z.string(),
  }),
});

export const updateBookSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    isbn: z.string().optional(),
    quantity: z.number().optional(),
    shelfLocation: z.string().optional(),
  }),
});

export const listBooksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive().optional()),
  }),
});

export const searchBooksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive().optional()),
    quantity: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().optional()),
    id: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().optional()),
    title: z.string().optional(),
    author: z.string().optional(),
    isbn: z.string().optional(),
    shelfLocation: z.string().optional(),
  }),
});

export type CreateBookRequestBodySchema = z.infer<
  typeof createBookSchema
>["body"];

export type UpdateBookRequestBodySchema = z.infer<
  typeof updateBookSchema
>["body"];

export type ListBooksRequestSchema = z.infer<typeof listBooksSchema>["query"];
export type SearchBooksRequestSchema = z.infer<
  typeof searchBooksSchema
>["query"];
