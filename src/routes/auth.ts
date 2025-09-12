import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { signUpSchema } from "../schemas/users.signup.schema";
import { logInSchema } from "../schemas/users.login.schema";

const authRouter: Router = Router();
const userController = new UserController();

authRouter.post("/signup", validate(signUpSchema), userController.signup);
authRouter.post("/login", validate(logInSchema), userController.login);

export default authRouter;
