import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ReturnedBorrowers } from "types/returned-borrows.types";
import { BadRequestException } from "../exceptions/bad-request";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { prismaClient } from "../index";
import {
  BorrowBookRequestBodySchema,
  BorrowingStatusEnum,
  DeleteBorrowerRequestBodySchema,
  ListBorrowsRequestBodySchema,
  ReturnBookRequestBodySchema,
  UpdateBorrowerRequestBodySchema,
} from "../schemas/borrowers.schemas";
import { PAGE_SIZE } from "../secrets";
import { Borrower, jsonToCsv } from "../utils/json-to-csv";
import { BaseController } from "./base.controller";

export class BorrowController extends BaseController {
  constructor() {
    super();
  }

  public borrow = async (req: Request, res: Response, next: NextFunction) => {
    const { params, body } = req as unknown as BorrowBookRequestBodySchema;
    const bookId = +params.bookId;
    const usrId = +req.user.id;

    // check dublicate borrow
    const oldBorrower = await prismaClient.borrower.findFirst({
      where: {
        bookId: bookId,
        userId: usrId,
      },
    });

    if (oldBorrower !== null) {
      throw new BadRequestException(
        ErrorMessage.DUBLICATE_BORROW,
        ErrorCode.DUBLICATE_BORROW
      );
    }
    try {
      // get the book to check quantity
      const borrowedBook = await prismaClient.book.findUnique({
        where: {
          id: bookId,
        },
      });

      if (borrowedBook?.quantity! <= 0) {
        throw new NotFoundException(
          ErrorMessage.BOOK_NOT_FOUND,
          ErrorCode.BOOK_NOT_FOUND
        );
      }

      // update quantity
      await prismaClient.book.update({
        where: {
          id: bookId,
        },
        data: {
          quantity: borrowedBook?.quantity! - 1,
        },
      });

      // add borrower quantity
      const borrower = await prismaClient.borrower.create({
        data: {
          bookId: bookId,
          userId: usrId,
          dueDate: body.dueDate,
        },
      });

      res.json(borrower);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND
      );
    }
  };

  public return = async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req as unknown as ReturnBookRequestBodySchema;
    const bookId = +params.bookId;
    const usrId = +req.user.id;

    // check dublicate borrow
    const oldBorrower = await prismaClient.borrower.findFirst({
      where: {
        bookId: bookId,
        userId: usrId,
        returnedAt: null,
      },
    });

    if (oldBorrower === null) {
      throw new BadRequestException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND
      );
    }

    try {
      const borrower = await prismaClient.borrower.update({
        where: {
          id: +oldBorrower.id,
        },
        data: {
          returnedAt: new Date(),
        },
      });

      // update quantity
      await prismaClient.book.update({
        where: {
          id: bookId,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });

      res.json(borrower);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND
      );
    }
  };

  public listMyBorrowedBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { page } = req.query as unknown as ListBorrowsRequestBodySchema;
    const usrId = +req.user.id;
    const borrwos = await prismaClient.borrower.findMany({
      where: {
        userId: usrId,
        returnedAt: null,
      },
    });

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const booksid = borrwos.map((item) => item.bookId);
    const [borrowedBooks, totalCount] = await Promise.all([
      prismaClient.book.findMany({
        where: {
          id: {
            in: booksid,
          },
        },
        skip: numberOfSkipped,
        take: +PAGE_SIZE!,
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
          shelfLocation: true,
        },
      }),
      prismaClient.book.count({
        where: {
          id: {
            in: booksid,
          },
        },
      }),
    ]);

    res.json({ totalCount, borrowedBooks });
  };

  public listAllBorrowers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { totalCount, returnedBorrowers } =
      await this.handleListAllBorrowsRequest(req, false);

    res.status(200).json({ totalCount, returnedBorrowers });
  };

  private handleListAllBorrowsRequest = async (
    req: Request,
    analytics: Boolean
  ) => {
    const { page, borrowingStatus, durationFrom } =
      req.query as unknown as ListBorrowsRequestBodySchema;

    // subtract duration from date
    let fromDate;
    if (durationFrom) {
      const now = new Date();
      fromDate = new Date(now.setDate(now.getDate() - durationFrom));
    }

    console.log(fromDate, borrowingStatus);

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const whereConditions = [];

    if (fromDate) {
      whereConditions.push(Prisma.sql`"borrowedAt" > ${fromDate}`);
    }

    if (borrowingStatus === BorrowingStatusEnum.OverDue) {
      whereConditions.push(
        Prisma.sql`"returnedAt" IS NOT NULL AND "returnedAt" > "dueDate"`
      );
    }

    const whereClause =
      whereConditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
        : Prisma.empty;

    const paginationQuery = analytics
      ? Prisma.empty
      : Prisma.sql`OFFSET ${numberOfSkipped} LIMIT ${+PAGE_SIZE!}`;

    const [borrowers, totalCountResult] = await Promise.all([
      prismaClient.$queryRaw(Prisma.sql`
    SELECT
      "borrowers"."id",
      "borrowers"."borrowedAt",
      "borrowers"."returnedAt",
      "borrowers"."dueDate",
      "book"."id" AS "book_id",
      "book"."title" AS "book_title",
      "book"."author" AS "book_author",
      "book"."isbn" AS "book_isbn",
      "book"."quantity" AS "book_quantity",
      "book"."shelfLocation" AS "book_shelfLocation",
      "user"."id" AS "user_id",
      "user"."name" AS "user_name",
      "user"."email" AS "user_email",
      "user"."role" AS "user_role"
    FROM
      "borrowers"
    LEFT JOIN
      "users" AS "user" ON "user"."id" = "borrowers"."userId"
    LEFT JOIN
      "books" AS "book" ON "book"."id" = "borrowers"."bookId"
    ${whereClause}
    ${paginationQuery}
  `) as Promise<any[]>,

      prismaClient.$queryRaw(Prisma.sql`
    SELECT COUNT(*) FROM "borrowers" LEFT JOIN "users" AS "user" ON "user"."id" = "borrowers"."userId" LEFT JOIN "books" AS "book" ON "book"."id" = "borrowers"."bookId" ${whereClause}
  `) as Promise<{ count: number | bigint }[]>,
    ]);

    // Extract the total count value
    const totalCount = Number(totalCountResult[0].count);

    type NestedBorrower = {
      id: string;
      borrowedAt: Date;
      returnedAt: Date | null;
      dueDate: Date;
      book: {
        id: string;
        title: string;
        author: string;
        isbn: string;
        quantity: number;
        shelfLocation: string;
      };
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    };

    const returnedBorrowers: NestedBorrower[] = (borrowers as any).map(
      (row: any) => {
        const book = row.book_id
          ? {
              id: row.book_id,
              title: row.book_title,
              author: row.book_author,
              isbn: row.book_isbn,
              quantity: row.book_quantity,
              shelfLocation: row.book_shelfLocation,
            }
          : null;

        const user = row.user_id
          ? {
              id: row.user_id,
              name: row.user_name,
              email: row.user_email,
              role: row.user_role,
            }
          : null;

        return {
          id: row.id,
          borrowedAt: row.borrowedAt,
          returnedAt: row.returnedAt,
          dueDate: row.dueDate,
          book,
          user,
        };
      }
    );

    console.log(totalCount);

    return { totalCount, returnedBorrowers };
  };

  public downloadAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      totalCount,
      returnedBorrowers,
    }: {
      totalCount: number;
      returnedBorrowers: ReturnedBorrowers[];
    } = await this.handleListAllBorrowsRequest(req, true);

    const csvBorrowers: Borrower[] = returnedBorrowers.map(
      (borrower) =>
        <Borrower>{
          id: borrower.id,
          borrowedAt: borrower.borrowedAt.toString(),
          dueDate: borrower.dueDate.toString(),
          returnedAt: borrower.returnedAt ? borrower.returnedAt.toString() : "",
          user_email: borrower.user.email,
          user_name: borrower.user.name,
          book_title: borrower.book.title,
          book_author: borrower.book.author,
        }
    );

    const csvFile: string = jsonToCsv(csvBorrowers);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="borrowers.csv"'
    );

    res.status(200).send(csvFile);
  };

  public updateBorrower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body, params } = req as unknown as UpdateBorrowerRequestBodySchema;
    const borrowerId = +params.id;

    await prismaClient.borrower
      .findFirst({
        where: {
          id: borrowerId,
          returnedAt: null,
        },
      })
      .then(() => {
        throw new NotFoundException(
          ErrorMessage.NO_OVERDUE_BORROWER,
          ErrorCode.NO_OVERDUE_BORROWER
        );
      });

    try {
      const updatedBorrower = await prismaClient.borrower.update({
        where: {
          id: borrowerId,
        },
        data: {
          dueDate: body.dueDate,
        },
      });
      res.json(updatedBorrower);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BORROWER_NOT_FOUND,
        ErrorCode.BORROWER_NOT_FOUND
      );
    }
  };

  public deleteBorrower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: borrowerId } =
      req.params as unknown as DeleteBorrowerRequestBodySchema;

    try {
      const deletedBorrow = await prismaClient.borrower.delete({
        where: {
          id: +borrowerId,
        },
      });
      res.json(deletedBorrow);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND
      );
    }
  };
}
