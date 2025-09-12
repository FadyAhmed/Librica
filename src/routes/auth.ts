import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const authRouter: Router = Router();
const userController = new UserController();

authRouter.post("/signup", userController.signup);
authRouter.post("/login", userController.login);

export default authRouter;
