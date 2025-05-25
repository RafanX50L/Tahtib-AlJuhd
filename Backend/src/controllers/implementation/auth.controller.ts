import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuth.service";
import { IAuthController } from "../interface/IAuth.controller";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import {
  deleteCookie,
  getIdFromCookie,
  setCookie,
} from "../../utils/cookie.utils";
import {
  createHttpError,
  generateAccessToken,
  verifyRefreshToken,
} from "../../utils";

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
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await this._authService.signIn(email, password);

      setCookie(res, refreshToken);

      console.log("Refresh Token:", refreshToken);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.LOGIN_SUCCESS,
        user,
        accessToken,
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
        accessToken,
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
        accessToken,
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
      if (id === null) {
        console.log("enterd to id null");
        createHttpError(
          HttpStatus.BAD_REQUEST,
          "Access token is missing or invalid"
        );
      }
      const { user } = await this._authService.getUserData(id as string);
      res.status(HttpStatus.OK).json({
        message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token using refresh token
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(
          createHttpError(HttpStatus.BAD_REQUEST, "Refresh token not found")
        );
      }

      const decodedToken = verifyRefreshToken(refreshToken);
      console.log(decodedToken);

      if (
        !decodedToken ||
        typeof decodedToken !== "object" ||
        !("id" in decodedToken) ||
        !("role" in decodedToken)
      ) {
        return next(createHttpError(HttpStatus.FORBIDDEN, "Invalid token"));
      }

      const { id, role } = decodedToken as { id: string; role: string };

      const user = await this._authService.getUserById(id);

      if (!user) {
        // Assuming clearRefreshTokenCookie is imported and available
        deleteCookie(res);
        return next(createHttpError(HttpStatus.NOT_FOUND, "User not found"));
      }
      if(user.isBlocked){
        console.log('user is bloked');
        deleteCookie(res);
        return next(createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.USER_IS_BLOKED));
      }

      const payload: {_id:string,role:string} = {
        _id: user && user._id ? user._id.toString() : "",
        role,
      };
      console.log('payloads ',payload);
      const user1 = {
        _id: user._id,
        name: user.name,
        email:user.email,
        role: user.role,
        personalization:user.personalization
      };

      const accessToken = generateAccessToken(payload);
      console.log(accessToken,user1);

      res.status(HttpStatus.OK).json({ accessToken, user: user1 });
    } catch (error) {
      next(error);
    }
  }
}
