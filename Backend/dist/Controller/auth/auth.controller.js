var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { deleteCookie, getIdFromCookie, setCookie, } from "../../utils/cookie.utils";
import { createHttpError } from "../../utils";
export class AuthController {
    constructor(_authService, _notificationService) {
        this._authService = _authService;
        this._notificationService = _notificationService;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authService.signUp(req.body);
                res.status(HttpStatus.OK).json({
                    email: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, accessToken, refreshToken, tokenVersion } = yield this._authService.signIn(email, password);
                console.log('user', user);
                const notifications = yield this._notificationService.getLastFiveNotification(user._id);
                setCookie(res, refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                console.log("Refresh Token:", refreshToken);
                console.log("notifications", notifications);
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.LOGIN_SUCCESS,
                    user,
                    notifications,
                    accessToken,
                    tokenVersion: tokenVersion || 0,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const { user, accessToken, refreshToken, tokenVersion } = yield this._authService.verifyOtp(email, otp);
                const notifications = yield this._notificationService.getLastFiveNotification(user._id);
                setCookie(res, refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(HttpStatus.CREATED).json({
                    message: HttpResponse.USER_CREATION_SUCCESS,
                    user,
                    notifications,
                    accessToken,
                    tokenVersion: tokenVersion || 0,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._authService.resendOtp(email);
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.OTP_RESEND_SUCCESS,
                    user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const forgotPassword = yield this._authService.forgotPassword(email);
                res.status(HttpStatus.OK).json({ forgotPassword });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, password } = req.body;
                const updatedUserPassword = yield this._authService.resetPassword(token, password);
                res.status(HttpStatus.OK).json(updatedUserPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    googleSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, role } = req.body;
                const { user, accessToken, refreshToken, tokenVersion } = yield this._authService.googleSignUp(email, name, role);
                const notifications = yield this._notificationService.getLastFiveNotification(user._id);
                setCookie(res, refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.LOGIN_SUCCESS,
                    user,
                    notifications,
                    accessToken,
                    tokenVersion: tokenVersion || 0,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = getIdFromCookie(req, "accessToken");
                if (!id) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, "Access token is missing or invalid");
                }
                const { user, tokenVersion } = yield this._authService.getUserData(id);
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
                    user,
                    tokenVersion: tokenVersion || 0,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entering to refreshToken");
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, "Refresh token not found");
                }
                const result = yield this._authService.refreshAccessToken(refreshToken);
                const notifications = yield this._notificationService.getLastFiveNotification(result.user._id);
                setCookie(res, result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(HttpStatus.OK).json({
                    accessToken: result.accessToken,
                    user: result.user,
                    notifications,
                    tokenVersion: result.tokenVersion,
                });
            }
            catch (error) {
                deleteCookie(res);
                next(error);
            }
        });
    }
}
//# sourceMappingURL=auth.controller.js.map