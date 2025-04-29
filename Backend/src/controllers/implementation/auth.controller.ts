import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuth.service";
import { IAuthController } from "../interface/IAuthController";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this._authService.signUp(req.body);
      res.status(201).json({ message: user });
    } catch (error) {
      next(error);
    }
  }
}
