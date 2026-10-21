"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtil = exports.ValidationError = void 0;
const status_constant_1 = require("../constants/status.constant");
class ValidationError extends Error {
    errors;
    statusCode = status_constant_1.HttpStatus.BAD_REQUEST;
    constructor(errors) {
        super("Validation failed");
        this.errors = errors;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class ValidationUtil {
    /**
     * Validates that a value is a positive integer
     */
    static validatePositiveInteger(value, fieldName) {
        if (value === undefined || value === null || value === '') {
            return 1; // default value
        }
        const num = parseInt(String(value), 10);
        if (isNaN(num) || num < 1) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must be a positive integer`,
                    value: value
                }]);
        }
        return num;
    }
    /**
     * Validates that a value is within a range
     */
    static validateRange(value, fieldName, min, max) {
        const num = this.validatePositiveInteger(value, fieldName);
        if (num < min || num > max) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must be between ${min} and ${max}`,
                    value: value
                }]);
        }
        return num;
    }
    /**
     * Validates that a value is one of the allowed options
     */
    static validateEnum(value, fieldName, allowedValues) {
        if (value === undefined || value === null || value === '') {
            return allowedValues[0]; // default to first option
        }
        const stringValue = String(value);
        if (!allowedValues.includes(stringValue)) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
                    value: value
                }]);
        }
        return stringValue;
    }
    /**
     * Validates and sanitizes a string value
     */
    static validateString(value, fieldName, maxLength) {
        if (value === undefined || value === null) {
            return '';
        }
        const stringValue = String(value).trim();
        if (maxLength && stringValue.length > maxLength) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must not exceed ${maxLength} characters`,
                    value: value
                }]);
        }
        return stringValue;
    }
    /**
     * Validates email format
     */
    static validateEmail(value, fieldName) {
        const email = this.validateString(value, fieldName);
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must be a valid email address`,
                    value: value
                }]);
        }
        return email;
    }
    /**
     * Validates ObjectId format
     */
    static validateObjectId(value, fieldName) {
        const id = this.validateString(value, fieldName);
        if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new ValidationError([{
                    field: fieldName,
                    message: `${fieldName} must be a valid ObjectId`,
                    value: value
                }]);
        }
        return id;
    }
    /**
     * Middleware to handle validation errors
     */
    static handleValidationError(err, req, res, next) {
        if (err instanceof ValidationError) {
            res.status(status_constant_1.HttpStatus.BAD_REQUEST).json({
                error: "Validation failed",
                details: err.errors,
                message: "Please check your input data and try again"
            });
            return;
        }
        next(err);
    }
    /**
     * Validates pagination parameters
     */
    static validatePagination(query) {
        const page = this.validateRange(query.page, 'page', 1, 1000);
        const limit = this.validateRange(query.limit, 'limit', 1, 100);
        return { page, limit };
    }
}
exports.ValidationUtil = ValidationUtil;
//# sourceMappingURL=validation.util.js.map