import { NextFunction, Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { prismaClient } from "../index";
import {
  BorrowBookRequestBodySchema,
  DeleteBorrowerRequestBodySchema,
  ListBorrowsRequestBodySchema,
  ReturnBookRequestBodySchema,
  UpdateBorrowerRequestBodySchema,
} from "../schemas/borrowers.schemas";
import { BaseController } from "./base.controller";
import { BadRequestException } from "../exceptions/bad-request";
import { PAGE_SIZE } from "../secrets";

export class BorrowController extends BaseController {
  constructor() {
    super();
  }

  async borrow(req: Request, res: Response, next: NextFunction) {
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
  }

  async return(req: Request, res: Response, next: NextFunction) {
    const { params } = req as unknown as ReturnBookRequestBodySchema;
    const bookId = +params.bookId;
    const usrId = +req.user.id;

    // check dublicate borrow
    const oldBorrower = await prismaClient.borrower.findFirst({
      where: {
        bookId: bookId,
        userId: usrId,
        returnedAt: null
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
  }

  async listMyBorrowedBooks(req: Request, res: Response, next: NextFunction) {
    const { page } = req.query as unknown as ListBorrowsRequestBodySchema;
    const usrId = +req.user.id;
    const borrwos = await prismaClient.borrower.findMany({
      where: {
        userId: usrId,
        returnedAt: null
      },
    });

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const borrowedBooks = await prismaClient.book.findMany({
      where: {
        id: {
          in: borrwos.map((item) => item.bookId),
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
    });

    res.json(borrowedBooks);
  }

  async listAllBorrowers(req: Request, res: Response, next: NextFunction) {
    const { page } = req.query as unknown as ListBorrowsRequestBodySchema;
    const usrId = +req.user.id;

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const borrowers = await prismaClient.borrower.findMany({
      skip: numberOfSkipped,
      take: +PAGE_SIZE!,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            quantity: true,
            shelfLocation: true,
          },
        },
      },
    });

    res.json(borrowers);
  }

  async updateBorrower(req: Request, res: Response, next: NextFunction) {
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
  }

  async deleteBorrower(req: Request, res: Response, next: NextFunction) {
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
  }
}
