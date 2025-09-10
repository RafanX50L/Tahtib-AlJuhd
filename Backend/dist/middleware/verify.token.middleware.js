"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
exports.verifyAnyToken = verifyAnyToken;
exports.verifyToken = verifyToken;
const response_message_constant_1 = require("../constants/response-message.constant");
const status_constant_1 = require("../constants/status.constant");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils");
// ✅ Base verification: any user
function verifyAnyToken() {
    return verifyTokenInternal(); // same logic, but no role check
}
// ✅ Role-specific verification
function verifyToken(requiredRole) {
    return verifyTokenInternal(requiredRole);
}
// Internal reusable logic
function verifyTokenInternal(requiredRole) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.NO_TOKEN));
        }
        const token = authHeader.split(" ")[1];
        try {
            const payload = (0, utils_1.verifyAccessToken)(token);
            if (!payload || typeof payload !== "object") {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.TOKEN_EXPIRED));
            }
            const { id, role, tokenVersion } = payload;
            if (!id || !role || !["client", "admin", "trainer"].includes(role)) {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.TOKEN_EXPIRED));
            }
            // ✅ If a role was required, enforce it
            if (requiredRole && role !== requiredRole) {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.FORBIDDEN, response_message_constant_1.HttpResponse.UNAUTHORIZED));
            }
            // validate user in DB
            const user = await user_model_1.UserModel.findById(id);
            if (!user)
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "User not found"));
            if (user.isBlocked) {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.USER_IS_BLOKED));
            }
            if (user.tokenVersion !== tokenVersion) {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, "Invalid token version"));
            }
            req.user = {
                id,
                role: role,
                tokenVersion,
            };
            next();
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.TOKEN_EXPIRED));
            }
            return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, "Invalid token"));
        }
    };
}
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=verify.token.middleware.js.map