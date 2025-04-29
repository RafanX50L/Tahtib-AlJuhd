import { Router } from "express";
import { UserRepository } from "../repositories/implementation/user.repository";
import { AuthService } from "../services/implementation/auth.service";
import { AuthController } from "../controllers/implementation/auth.controller";

const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post("/register", authController.signUp.bind(authController));

export default authRouter;