"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerErrorHandler = void 0;
const status_constant_1 = require("../constants/status.constant");
const validation_util_1 = require("./validation.util");
/**
 * Common error handler for admin controllers
 * Handles validation errors and other errors consistently
 */
class ControllerErrorHandler {
    /**
     * Handles validation errors with consistent response format
     * @param error - The error to handle
     * @param res - Express response object
     * @returns true if error was handled, false if should continue to next middleware
     */
    static handleValidationError(error, res) {
        if (error instanceof validation_util_1.ValidationError) {
            res.status(status_constant_1.HttpStatus.BAD_REQUEST).json({
                error: "Validation failed",
                details: error.errors,
                message: "Please check your input parameters and try again"
            });
            return true;
        }
        return false;
    }
    /**
     * Handles all errors in controller methods
     * @param error - The error to handle
     * @param res - Express response object
     * @param next - Express next function
     */
    static handleError(error, res, next) {
        // Try to handle as validation error first
        if (this.handleValidationError(error, res)) {
            return;
        }
        // If not a validation error, pass to next middleware
        next(error);
    }
    /**
     * Handles not found responses consistently
     * @param res - Express response object
     * @param message - Custom message (optional)
     */
    static handleNotFound(res, message = "Resource not found") {
        res.status(status_constant_1.HttpStatus.NOT_FOUND).json({
            success: false,
            message,
            data: null,
        });
    }
    /**
     * Handles success responses consistently
     * @param res - Express response object
     * @param data - Response data
     * @param message - Success message
     * @param statusCode - HTTP status code (default: 200)
     */
    static handleSuccess(res, data, message, statusCode = status_constant_1.HttpStatus.OK) {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
}
exports.ControllerErrorHandler = ControllerErrorHandler;
//# sourceMappingURL=controller-error-handler.util.js.map