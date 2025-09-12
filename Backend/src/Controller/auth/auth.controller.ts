import { Request, Response, NextFunction } from "express";
import { IAuthService } from "@/core/interface/services/auth/IAuth.service";
import { IAuthController } from "../../core/interface/controllers/auth/IAuth.controller";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import {
  deleteCookie,
  getIdFromCookie,
  setCookie,
} from "../../utils/cookie.utils";
import { createHttpError } from "../../utils";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";
import { env } from "@/config/env.config";

const maxAge = Number(env.COOKIE_MAX_AGE);

export class AuthController implements IAuthController {
  constructor(
    private _authService: IAuthService,
    private _notificationService: INotificationService,
  ) {}

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
      const { user, accessToken, refreshToken, tokenVersion } =
        await this._authService.signIn(email, password);
        console.log('user',user);
      const notifications = await this._notificationService.getLastFiveNotification((user._id as string));
      console.log('maxAge',maxAge, typeof maxAge);
      setCookie(res, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge, // 7 days
      });

      console.log("Refresh Token:", refreshToken);
      console.log("notifications",notifications);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user,
        notifications,
        accessToken,
        tokenVersion: tokenVersion || 0,
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
      const { user, accessToken, refreshToken, tokenVersion } =
        await this._authService.verifyOtp(email, otp);
      const notifications = await this._notificationService.getLastFiveNotification((user._id as string));
      setCookie(res, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
      });

      res.status(HttpStatus.CREATED).json({
        message: HttpResponse.USER_CREATION_SUCCESS,
        user,
        notifications,
        accessToken,
        tokenVersion: tokenVersion || 0,
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
      const { user, accessToken, refreshToken, tokenVersion } =
        await this._authService.googleSignUp(email, name, role);
      const notifications = await this._notificationService.getLastFiveNotification((user._id as string));
      setCookie(res, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
      });

      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user,
        notifications,
        accessToken,
        tokenVersion: tokenVersion || 0,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = getIdFromCookie(req, "accessToken");
      if (!id) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Access token is missing or invalid"
        );
      }
      const { user, tokenVersion } = await this._authService.getUserData(id);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
        user,
        tokenVersion: tokenVersion || 0,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("Entering to refreshToken");
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Refresh token not found"
        );
      }

      const result = await this._authService.refreshAccessToken(refreshToken);
      const notifications = await this._notificationService.getLastFiveNotification((result.user._id as string));

      setCookie(res, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
      });

      res.status(HttpStatus.OK).json({
        accessToken: result.accessToken,
        user: result.user,
        notifications,
        tokenVersion: result.tokenVersion,
      });
    } catch (error) {
      deleteCookie(res);
      next(error);
    }
  }
}
