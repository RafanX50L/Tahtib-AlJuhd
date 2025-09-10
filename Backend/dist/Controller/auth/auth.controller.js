"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
const cookie_utils_1 = require("../../utils/cookie.utils");
const utils_1 = require("../../utils");
class AuthController {
    _authService;
    _notificationService;
    constructor(_authService, _notificationService) {
        this._authService = _authService;
        this._notificationService = _notificationService;
    }
    async signUp(req, res, next) {
        try {
            const user = await this._authService.signUp(req.body);
            res.status(status_constant_1.HttpStatus.OK).json({
                email: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken, tokenVersion } = await this._authService.signIn(email, password);
            console.log('user', user);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            console.log("Refresh Token:", refreshToken);
            console.log("notifications", notifications);
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.LOGIN_SUCCESS,
                user,
                notifications,
                accessToken,
                tokenVersion: tokenVersion || 0,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            const { user, accessToken, refreshToken, tokenVersion } = await this._authService.verifyOtp(email, otp);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(status_constant_1.HttpStatus.CREATED).json({
                message: response_message_constant_1.HttpResponse.USER_CREATION_SUCCESS,
                user,
                notifications,
                accessToken,
                tokenVersion: tokenVersion || 0,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        try {
            const { email } = req.body;
            const user = await this._authService.resendOtp(email);
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.OTP_RESEND_SUCCESS,
                user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const forgotPassword = await this._authService.forgotPassword(email);
            res.status(status_constant_1.HttpStatus.OK).json({ forgotPassword });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const updatedUserPassword = await this._authService.resetPassword(token, password);
            res.status(status_constant_1.HttpStatus.OK).json(updatedUserPassword);
        }
        catch (error) {
            next(error);
        }
    }
    async googleSignUp(req, res, next) {
        try {
            const { email, name, role } = req.body;
            const { user, accessToken, refreshToken, tokenVersion } = await this._authService.googleSignUp(email, name, role);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.LOGIN_SUCCESS,
                user,
                notifications,
                accessToken,
                tokenVersion: tokenVersion || 0,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyUser(req, res, next) {
        try {
            const id = (0, cookie_utils_1.getIdFromCookie)(req, "accessToken");
            if (!id) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Access token is missing or invalid");
            }
            const { user, tokenVersion } = await this._authService.getUserData(id);
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL,
                user,
                tokenVersion: tokenVersion || 0,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        console.log("Entering to refreshToken");
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Refresh token not found");
            }
            const result = await this._authService.refreshAccessToken(refreshToken);
            const notifications = await this._notificationService.getLastFiveNotification(result.user._id);
            (0, cookie_utils_1.setCookie)(res, result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(status_constant_1.HttpStatus.OK).json({
                accessToken: result.accessToken,
                user: result.user,
                notifications,
                tokenVersion: result.tokenVersion,
            });
        }
        catch (error) {
            (0, cookie_utils_1.deleteCookie)(res);
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map