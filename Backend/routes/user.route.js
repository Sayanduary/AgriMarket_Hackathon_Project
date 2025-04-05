import { Router } from 'express'
import { registerUserController } from '../controllers/user.controller.js'

const userRouter = Router();

// Corrected this line
userRouter.post('/register', registerUserController);

export default userRouter;
