"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_error_util_1 = require("../utils/http-error.util");
const status_constant_1 = require("../constants/status.constant");
const response_message_constant_1 = require("../constants/response-message.constant");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const errorHandler = (err, _req, res, next) => {
    let statusCode = status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR;
    let message = response_message_constant_1.HttpResponse.SERVER_ERROR;
    console.log('err', err.message);
    if (err instanceof http_error_util_1.HttpError) {
        logger_utils_1.default.error("Errors:", err);
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        logger_utils_1.default.error("unhandled error:", err);
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map