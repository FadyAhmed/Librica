import { Router } from "express";
import {
  createBookSchema,
  listBooksSchema,
  searchBooksSchema,
  updateBookSchema,
} from "../schemas/books.schemas";
import { BookController } from "../controllers/book.controller";
import { validate } from "../middlewares/validate";
import authMiddleWare from "../middlewares/auth";
import adminRoleMiddleware from "../middlewares/roles/admin";

const bookRouter: Router = Router();
const bookController = new BookController();

bookRouter.post(
  "/create",
  [authMiddleWare, adminRoleMiddleware],
  validate(createBookSchema),
  bookController.createBook
);

bookRouter.put(
  "/update/:id",
  [authMiddleWare, adminRoleMiddleware],
  validate(updateBookSchema),
  bookController.updateBook
);

bookRouter.delete(
  "/delete/:id",
  [authMiddleWare, adminRoleMiddleware],
  bookController.deleteBook
);

bookRouter.get(
  "/",
  [authMiddleWare],
  validate(listBooksSchema),
  bookController.listAllBooks
);

bookRouter.get(
  "/search",
  [authMiddleWare],
  validate(searchBooksSchema),
  bookController.searchBooks
);

export default bookRouter;
