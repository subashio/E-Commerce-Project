import { Router } from "express";
import {
  deleteUserController,
  ForgotPassword,
  getAllUsersController,
  LoginController,
  LogoutController,
  RefreshToken,
  registerController,
  ResetPassword,
  updatedUserDetails,
  uploadAvatar,
  userDetails,
  verifyEmailController,
  VerifyForgotPassword,
} from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { admin } from "../middleware/admin.js";

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", LoginController);
userRouter.get("/logout", auth, LogoutController);
userRouter.put("/upload-avatar", auth, upload.single("image"), uploadAvatar);
userRouter.put("/update-user", auth, updatedUserDetails);
userRouter.put("/forgot-password", ForgotPassword);
userRouter.put("/verify-forgot-password-otp", VerifyForgotPassword);
userRouter.put("/reset-password", ResetPassword);
userRouter.post("/refresh-token", RefreshToken);
userRouter.get("/user-details", auth, userDetails);
userRouter.get("/all-user-details", auth, admin, getAllUsersController);
userRouter.delete("/delete", auth, deleteUserController);

export default userRouter;
