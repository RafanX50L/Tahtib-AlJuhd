import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuth.service";
import { IAuthController } from "../interface/IAuthController";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { setCookie } from "../../utils/cookie.utils";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this._authService.signUp(req.body);
      res.status(HttpStatus.OK).json({
        email: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const { role, accessToken, refreshToken } = await this._authService.signIn(
        email,
        password
      );

      setCookie(res, refreshToken);

      console.log("Refresh Token:", refreshToken);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user:{role},
        token: accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const { user, accessToken, refreshToken} = await this._authService.verifyOtp(email, otp);

      setCookie(res,refreshToken);

      res.status(HttpStatus.CREATED).json({
        message: HttpResponse.USER_CREATION_SUCCESS,
        user,
        token: accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this._authService.resendOtp(email);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.OTP_RESEND_SUCCESS,
        user,
      });
    } catch (error) {
      next(error);
    }
  } 
}
