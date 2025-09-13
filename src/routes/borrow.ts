import { Router } from "express";
import { BorrowController } from "../controllers/borrow.controller";
import authMiddleWare from "../middlewares/auth";
import adminRoleMiddleware from "../middlewares/roles/admin";
import { validate } from "../middlewares/validate";
import {
  borrowBookSchema,
  deleteBorrowerSchema,
  listBorrowsSchema,
  returnBookSchema,
  updateBorrowerSchema,
} from "../schemas/borrowers.schemas";

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
  validate(updateBorrowerSchema),
  borrowController.updateBorrower
);

borrowRouter.delete(
  "/:id",
  [authMiddleWare, adminRoleMiddleware],
  validate(deleteBorrowerSchema),
  borrowController.deleteBorrower
);

export default borrowRouter;
