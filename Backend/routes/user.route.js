import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/login', loginUserController);
userRouter.post('/logout', logoutUserController); 

export default userRouter;
