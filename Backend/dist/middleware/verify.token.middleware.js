var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../constants/response-message.constant";
import { HttpStatus } from "../constants/status.constant";
import { UserModel } from "../models/user.model";
import { createHttpError, verifyAccessToken } from "../utils";
// ✅ Base verification: any user
export function verifyAnyToken() {
    return verifyTokenInternal(); // same logic, but no role check
}
// ✅ Role-specific verification
export function verifyToken(requiredRole) {
    return verifyTokenInternal(requiredRole);
}
// Internal reusable logic
function verifyTokenInternal(requiredRole) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN));
        }
        const token = authHeader.split(" ")[1];
        try {
            const payload = verifyAccessToken(token);
            if (!payload || typeof payload !== "object") {
                return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
            }
            const { id, role, tokenVersion } = payload;
            if (!id || !role || !["client", "admin", "trainer"].includes(role)) {
                return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
            }
            // ✅ If a role was required, enforce it
            if (requiredRole && role !== requiredRole) {
                return next(createHttpError(HttpStatus.FORBIDDEN, HttpResponse.UNAUTHORIZED));
            }
            // validate user in DB
            const user = yield UserModel.findById(id);
            if (!user)
                return next(createHttpError(HttpStatus.NOT_FOUND, "User not found"));
            if (user.isBlocked) {
                return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED));
            }
            if (user.tokenVersion !== tokenVersion) {
                return next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token version"));
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
                return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
            }
            return next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token"));
        }
    });
}
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
};
//# sourceMappingURL=verify.token.middleware.js.map