import { Router } from "express";
import {
  borrowBookSchema,
  deleteBorrowerSchema,
  listBorrowsSchema,
  returnBookSchema,
} from "../schemas/borrowers.schemas";
import { BorrowController } from "../controllers/borrow.controller";
import { validate } from "../middlewares/validate";
import authMiddleWare from "../middlewares/auth";
import adminRoleMiddleware from "../middlewares/roles/admin";

const borrowRouter: Router = Router();
const borrowController = new BorrowController();

borrowRouter.post(
  "/check-out/:bookId",
  [authMiddleWare],
  validate(borrowBookSchema),
  borrowController.borrow
);

borrowRouter.post(
  "/return/:bookId",
  [authMiddleWare],
  validate(returnBookSchema),
  borrowController.return
);

borrowRouter.get(
  "/my-borrows",
  [authMiddleWare],
  validate(listBorrowsSchema),
  borrowController.listMyBorrowedBooks
);

borrowRouter.get(
  "/",
  [authMiddleWare, adminRoleMiddleware],
  validate(listBorrowsSchema),
  borrowController.listAllBorrowers
);

borrowRouter.put(
  "/:id",
  [authMiddleWare, adminRoleMiddleware],
  validate(borrowBookSchema),
  borrowController.updateBorrower
);

borrowRouter.delete(
  "/:id",
  [authMiddleWare, adminRoleMiddleware],
  validate(deleteBorrowerSchema),
  borrowController.deleteBorrower
);

export default borrowRouter;
