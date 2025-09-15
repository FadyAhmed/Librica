import { NextFunction, Request, Response } from "express";
import {
  CreateBookRequestBodySchema,
  ListBooksRequestSchema,
  SearchBooksRequestSchema,
  UpdateBookRequestBodySchema,
} from "schemas/books.schemas";
import { prismaClient } from "../index";
import { BaseController } from "./base.controller";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { PAGE_SIZE } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";

export class BookController extends BaseController {
  constructor() {
    super();
  }

  async createBook(req: Request, res: Response, next: NextFunction) {
    const body = req.body as CreateBookRequestBodySchema;
    const oldBook = await prismaClient.book.findFirst({
      where: {
        isbn: body.isbn,
        title: body.title,
        author: body.author,
      },
    });
    if (oldBook) {
      throw new BadRequestException(
        ErrorMessage.BOOK_IS_DUBLICATE,
        ErrorCode.BOOK_IS_DUBLICATE
      );
    }
    const book = await prismaClient.book.create({
      data: {
        ...body,
      },
    });
    res.json(book);
  }

  async updateBook(req: Request, res: Response, next: NextFunction) {
    const body = req.body as UpdateBookRequestBodySchema;
    const bookId = encodeURIComponent(req.params.id);
    try {
      const updatedBook = await prismaClient.book.update({
        where: {
          id: +bookId,
        },
        data: {
          ...body,
        },
      });
      res.json(updatedBook);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND,
        null
      );
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.id;
    try {
      const deletedBook = await prismaClient.book.delete({
        where: {
          id: +bookId,
        },
      });
      res.json(deletedBook);
    } catch (err) {
      throw new NotFoundException(
        ErrorMessage.BOOK_NOT_FOUND,
        ErrorCode.BOOK_NOT_FOUND,
        null
      );
    }
  }

  async listAllBooks(req: Request, res: Response, next: NextFunction) {
    const { page } = req.query as ListBooksRequestSchema;

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const totalCount = await prismaClient.book.count();
    const books = await prismaClient.book.findMany({
      skip: numberOfSkipped,
      take: +PAGE_SIZE!,
    });
    res.json({ totalCount, books });
  }

  async searchBooks(req: Request, res: Response, next: NextFunction) {
    const { quantity, id, title, author, isbn, shelfLocation, page } =
      req.query as unknown as SearchBooksRequestSchema;

    let numberOfSkipped: number = 0;
    if (page != null) {
      numberOfSkipped = (page - 1) * +PAGE_SIZE!;
    }

    const whereConditions: any[] = [];

    const stringSearchConditions = [
      title ? { title: { contains: title, mode: "insensitive" } } : null,
      author ? { author: { contains: author, mode: "insensitive" } } : null,
      isbn ? { isbn: { contains: isbn, mode: "insensitive" } } : null,
      shelfLocation
        ? { shelfLocation: { contains: shelfLocation, mode: "insensitive" } }
        : null,
    ].filter(Boolean);

    if (stringSearchConditions.length > 0) {
      whereConditions.push({
        OR: stringSearchConditions,
      });
    }

    // TODO: Solve type issue
    if (quantity !== undefined && !isNaN(quantity)) {
      whereConditions.push({ quantity: parseInt(quantity.toString()) });
    }

    if (id !== undefined && !isNaN(id)) {
      whereConditions.push({ id: parseInt(id.toString()) });
    }

    const searchCriteria = {
      AND: whereConditions,
    };

    const [books, totalCount] = await Promise.all([
      prismaClient.book.findMany({
        where: searchCriteria,
        skip: numberOfSkipped,
        take: +PAGE_SIZE!,
      }),

      prismaClient.book.count({
        where: searchCriteria,
      }),
    ]);

    res.json({ totalCount, books });
  }
}
