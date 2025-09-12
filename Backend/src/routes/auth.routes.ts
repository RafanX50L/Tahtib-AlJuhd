import { Router } from "express";
import { UserRepository } from "@/Repository/user.Repository";
import { AuthService } from "@/Services/auth/auth.service";
import { AuthController } from "@/Controller/auth/auth.controller";
import { NotificationRepository } from "@/Repository/Notification.repository";
import { NotificationService } from "@/Services/shared/notification.service";

const authRouter = Router();

const userRepository = new UserRepository();
const notificationRepo = new NotificationRepository();
const authService = new AuthService(userRepository);
const notificationService = new NotificationService(notificationRepo);
const authController = new AuthController(authService,notificationService);



authRouter.post("/register", authController.signUp.bind(authController));
authRouter.post("/verify-otp", authController.verifyOtp.bind(authController));
authRouter.post("/resend-otp", authController.resendOtp.bind(authController));
authRouter.post("/login", authController.signIn.bind(authController)); 
authRouter.post("/forgot-password", authController.forgotPassword.bind(authController));
authRouter.post("/reset-password", authController.resetPassword.bind(authController));
authRouter.post("/google-signup", authController.googleSignUp.bind(authController));
authRouter.post("/refresh-Token", authController.refreshToken.bind(authController));
authRouter.get('/autherisation',authController.verifyUser.bind(authController));

export default authRouter;