"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdFromCookie = exports.deleteCookie = exports.getCookie = exports.setCookie = void 0;
const env_config_1 = require("../config/env.config");
const jwt_utils_1 = require("./jwt.utils");
const http_error_util_1 = require("./http-error.util");
const status_constant_1 = require("../constants/status.constant");
const setCookie = (res, refreshToken, options = {
    httpOnly: true,
    secure: env_config_1.env.NODE_ENV === 'production',
    sameSite: env_config_1.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
}) => {
    res.cookie('refreshToken', refreshToken, options);
};
exports.setCookie = setCookie;
const getCookie = (req, name) => {
    if (!req.cookies) {
        console.warn('Cookie-parser middleware is not initialized or cookies are not present');
        return undefined;
    }
    return req.cookies[name];
};
exports.getCookie = getCookie;
const deleteCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env_config_1.env.NODE_ENV === 'production',
        sameSite: env_config_1.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/',
    });
};
exports.deleteCookie = deleteCookie;
const getIdFromCookie = (req, cookieName = 'refreshToken') => {
    console.log('Entered getIdFromCookie for:', cookieName);
    try {
        const token = (0, exports.getCookie)(req, cookieName);
        if (!token) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, 'Refresh token not found in cookie');
        }
        const decoded = (0, jwt_utils_1.verifyRefreshToken)(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.FORBIDDEN, 'Invalid refresh token');
        }
        return decoded.id;
    }
    catch (error) {
        console.error('Error in getIdFromCookie:', error);
        throw error; // Propagate the error to be handled by the caller
    }
};
exports.getIdFromCookie = getIdFromCookie;
//# sourceMappingURL=cookie.utils.js.map