import { Router } from "express";
import authRouter from "./auth";
import bookRouter from "./book";
import borrowerRouter from "./borrow";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/books', bookRouter);
rootRouter.use('/borrower', borrowerRouter);

export default rootRouter;