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

export enum BorrowingStatusEnum {
  All = "ALL",
  OverDue = "OVER_DUE",
}

const BorrowingStatus = [BorrowingStatusEnum.All, BorrowingStatusEnum.OverDue] as const;

export const listBorrowsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive().optional()),
    durationFrom: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive().optional()),
    borrowingStatus: z.enum(BorrowingStatus).optional(),
  }),
});

export const updateBorrowerSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .pipe(z.number().int().positive()),
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
export type ListBorrowsRequestBodySchema = z.infer<
  typeof listBorrowsSchema
>["query"];
export type UpdateBorrowerRequestBodySchema = z.infer<
  typeof updateBorrowerSchema
>;
export type DeleteBorrowerRequestBodySchema = z.infer<
  typeof deleteBorrowerSchema
>["params"];
