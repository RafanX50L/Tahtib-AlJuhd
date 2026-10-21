"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
const cookie_utils_1 = require("../../utils/cookie.utils");
const utils_1 = require("../../utils");
const env_config_1 = require("../../config/env.config");
const AuthDTO_1 = require("../../dtos/reverse-mapping/auth/AuthDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
const maxAge = Number(env_config_1.env.COOKIE_MAX_AGE);
class AuthController {
    _authService;
    _notificationService;
    constructor(_authService, _notificationService) {
        this._authService = _authService;
        this._notificationService = _notificationService;
    }
    async signUp(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateSignUpRequest(req.body);
            // Call service with validated parameters
            const user = await this._authService.signUp(validatedBody);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { email: user }, "User registration initiated successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async signIn(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateSignInRequest(req.body);
            // Call service with validated parameters
            const { user, accessToken, refreshToken } = await this._authService.signIn(validatedBody.email, validatedBody.password);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: maxAge, // 7 days
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                user,
                notifications,
                accessToken,
            }, response_message_constant_1.HttpResponse.LOGIN_SUCCESS);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateVerifyOtpRequest(req.body);
            // Call service with validated parameters
            const { user, accessToken, refreshToken } = await this._authService.verifyOtp(validatedBody.email, validatedBody.otp);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: maxAge,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                user,
                notifications,
                accessToken,
            }, response_message_constant_1.HttpResponse.USER_CREATION_SUCCESS, status_constant_1.HttpStatus.CREATED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async resendOtp(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateResendOtpRequest(req.body);
            // Call service with validated parameters
            const user = await this._authService.resendOtp(validatedBody.email);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { user }, response_message_constant_1.HttpResponse.OTP_RESEND_SUCCESS);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateForgotPasswordRequest(req.body);
            // Call service with validated parameters
            const forgotPassword = await this._authService.forgotPassword(validatedBody.email);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { forgotPassword }, "Password reset email sent successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async resetPassword(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateResetPasswordRequest(req.body);
            // Call service with validated parameters
            const updatedUserPassword = await this._authService.resetPassword(validatedBody.token, validatedBody.password);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, updatedUserPassword, "Password reset successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async googleSignUp(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AuthDTO_1.AuthDTO.validateGoogleSignUpRequest(req.body);
            // Call service with validated parameters
            const { user, accessToken, refreshToken } = await this._authService.googleSignUp(validatedBody.email, validatedBody.name, validatedBody.role);
            const notifications = await this._notificationService.getLastFiveNotification(user._id);
            (0, cookie_utils_1.setCookie)(res, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: maxAge,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                user,
                notifications,
                accessToken,
            }, response_message_constant_1.HttpResponse.LOGIN_SUCCESS);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async verifyUser(req, res, next) {
        try {
            const id = (0, cookie_utils_1.getIdFromCookie)(req, "accessToken");
            if (!id) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Access token is missing or invalid");
            }
            const { user } = await this._authService.getUserData(id);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { user }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async refreshToken(req, res, next) {
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
                maxAge: maxAge,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                accessToken: result.accessToken,
                user: result.user,
                notifications,
            }, "Token refreshed successfully");
        }
        catch (error) {
            (0, cookie_utils_1.deleteCookie)(res);
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map