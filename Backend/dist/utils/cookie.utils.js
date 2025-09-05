import { env } from '../config/env.config';
import { verifyRefreshToken } from './jwt.utils';
import { createHttpError } from './http-error.util';
import { HttpStatus } from '../constants/status.constant';
export const setCookie = (res, refreshToken, options = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
}) => {
    res.cookie('refreshToken', refreshToken, options);
};
export const getCookie = (req, name) => {
    if (!req.cookies) {
        console.warn('Cookie-parser middleware is not initialized or cookies are not present');
        return undefined;
    }
    return req.cookies[name];
};
export const deleteCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/',
    });
};
export const getIdFromCookie = (req, cookieName = 'refreshToken') => {
    console.log('Entered getIdFromCookie for:', cookieName);
    try {
        const token = getCookie(req, cookieName);
        if (!token) {
            throw createHttpError(HttpStatus.BAD_REQUEST, 'Refresh token not found in cookie');
        }
        const decoded = verifyRefreshToken(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            throw createHttpError(HttpStatus.FORBIDDEN, 'Invalid refresh token');
        }
        return decoded.id;
    }
    catch (error) {
        console.error('Error in getIdFromCookie:', error);
        throw error; // Propagate the error to be handled by the caller
    }
};
//# sourceMappingURL=cookie.utils.js.map