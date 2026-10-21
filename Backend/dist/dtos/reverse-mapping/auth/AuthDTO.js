"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Auth DTO class for input validation
 * Handles validation and transformation of auth-related requests
 */
class AuthDTO {
    /**
     * Validates and transforms sign up request
     */
    static validateSignUpRequest(body) {
        const name = validation_util_1.ValidationUtil.validateString(body.name, 'name', 100);
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        const password = validation_util_1.ValidationUtil.validateString(body.password, 'password', 128);
        const role = validation_util_1.ValidationUtil.validateEnum(body.role, 'role', ['client', 'trainer']);
        // Validate password strength
        if (password.length < 8) {
            throw new validation_util_1.ValidationError([{
                    field: 'password',
                    message: 'Password must be at least 8 characters long',
                    value: password
                }]);
        }
        // Validate password contains at least one letter and one number
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            throw new validation_util_1.ValidationError([{
                    field: 'password',
                    message: 'Password must contain at least one letter and one number',
                    value: password
                }]);
        }
        return {
            name,
            email,
            password,
            role,
        };
    }
    /**
     * Validates and transforms sign in request
     */
    static validateSignInRequest(body) {
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        const password = validation_util_1.ValidationUtil.validateString(body.password, 'password', 128);
        return {
            email,
            password,
        };
    }
    /**
     * Validates and transforms verify OTP request
     */
    static validateVerifyOtpRequest(body) {
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        const otp = validation_util_1.ValidationUtil.validateString(body.otp, 'otp', 10);
        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            throw new validation_util_1.ValidationError([{
                    field: 'otp',
                    message: 'OTP must be exactly 6 digits',
                    value: otp
                }]);
        }
        return {
            email,
            otp,
        };
    }
    /**
     * Validates and transforms resend OTP request
     */
    static validateResendOtpRequest(body) {
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        return {
            email,
        };
    }
    /**
     * Validates and transforms forgot password request
     */
    static validateForgotPasswordRequest(body) {
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        return {
            email,
        };
    }
    /**
     * Validates and transforms reset password request
     */
    static validateResetPasswordRequest(body) {
        const token = validation_util_1.ValidationUtil.validateString(body.token, 'token', 500);
        const password = validation_util_1.ValidationUtil.validateString(body.password, 'password', 128);
        // Validate password strength
        if (password.length < 8) {
            throw new validation_util_1.ValidationError([{
                    field: 'password',
                    message: 'Password must be at least 8 characters long',
                    value: password
                }]);
        }
        // Validate password contains at least one letter and one number
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            throw new validation_util_1.ValidationError([{
                    field: 'password',
                    message: 'Password must contain at least one letter and one number',
                    value: password
                }]);
        }
        return {
            token,
            password,
        };
    }
    /**
     * Validates and transforms Google sign up request
     */
    static validateGoogleSignUpRequest(body) {
        const email = validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        const name = validation_util_1.ValidationUtil.validateString(body.name, 'name', 100);
        const role = validation_util_1.ValidationUtil.validateEnum(body.role, 'role', ['client', 'trainer']);
        return {
            email,
            name,
            role,
        };
    }
}
exports.AuthDTO = AuthDTO;
//# sourceMappingURL=AuthDTO.js.map