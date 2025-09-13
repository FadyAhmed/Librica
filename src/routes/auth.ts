import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { logInSchema, signUpSchema } from "../schemas/users.schemas";
import authMiddleware from "../middlewares/auth";

const authRouter: Router = Router();
const userController = new UserController();

authRouter.post("/signup", validate(signUpSchema), userController.signup);
authRouter.post("/login", validate(logInSchema), userController.login);
authRouter.get("/me", [authMiddleware], userController.me);

export default authRouter;
