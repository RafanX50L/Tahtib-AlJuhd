import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuth.service";
import { IAuthController } from "../interface/IAuthController";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { getCookie, setCookie } from "../../utils/cookie.utils";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}
  async refreshAcessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = getCookie(req, "refreshToken");

      if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Refresh token is required",
        });
        return;
      }

      const { accessToken } = await this._authService.refreshAccessToken(refreshToken);

      res.status(HttpStatus.OK).json({
        message: HttpResponse.TOKEN_GENERATED_SUCCESS,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

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
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { role, accessToken, refreshToken } =
        await this._authService.signIn(email, password);

      setCookie(res, refreshToken);

      console.log("Refresh Token:", refreshToken);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user: { role },
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
      const { user, accessToken, refreshToken } =
        await this._authService.verifyOtp(email, otp);

      setCookie(res, refreshToken);

      res.status(HttpStatus.CREATED).json({
        message: HttpResponse.USER_CREATION_SUCCESS,
        user,
        token: accessToken,
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

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const forgotPassword = await this._authService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ forgotPassword });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;
      const updatedUserPassword = await this._authService.resetPassword(
        token,
        password
      );
      res.status(HttpStatus.OK).json(updatedUserPassword);
    } catch (error) {
      next(error);
    }
  }
  async googleSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, name, role } = req.body;
      const { user, accessToken, refreshToken } =
        await this._authService.googleSignUp(email, name, role);
      setCookie(res, refreshToken);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user,
        token: accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}
