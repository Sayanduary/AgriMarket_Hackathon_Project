import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  verifyOtpController,
  userAvatarController,
  deleteImageController, updateUserDetailsController,
  forgotPasswordController, resetPasswordController,userDetailsController
} from "../controllers/user.controller.js";
import { uploadSingle, uploadMultiple } from '../config/multer.config.js';
import { auth } from '../middleware/auth.middleware.js';


const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/login', loginUserController);
userRouter.post('/logout', logoutUserController);
userRouter.post('/verify-otp', verifyOtpController);

userRouter.post('/upload-avatar', auth, uploadSingle, userAvatarController);

// For multiple images
userRouter.post('/upload-avatars', auth, uploadMultiple, userAvatarController);


userRouter.delete('/deleteImage', auth, deleteImageController)

userRouter.put('/:id', auth, updateUserDetailsController);

userRouter.post('/forgotPassword', auth, forgotPasswordController);

userRouter.post('/resetPassword', auth, resetPasswordController);

userRouter.get('/user-details',auth,userDetailsController)

export default userRouter;
