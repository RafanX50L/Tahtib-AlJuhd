


import { env } from '../config/env.config';
import { Response, Request } from 'express';
import {  verifyRefreshToken } from './jwt.utils';
import { createHttpError } from './http-error.util';
import { HttpStatus } from '../constants/status.constant';
import logger from './logger.utils';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
}

const maxAge = Number(env.COOKIE_MAX_AGE);

export const setCookie = (res: Response, refreshToken: string, options: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: maxAge,
  path: '/',
}) => {
  logger.debug('Setting cookie with options:', maxAge, options);
  res.cookie('refreshToken', refreshToken, options);
};

export const getCookie = (req: Request, name: string): string | undefined => {
  if (!req.cookies) {
    logger.warn('Cookie-parser middleware is not initialized or cookies are not present');
    return undefined;
  }
  return req.cookies[name];
};

export const deleteCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
  });
};

export const getIdFromCookie = (req: Request, cookieName: string = 'refreshToken'): string => {
  logger.debug('Entered getIdFromCookie for:', cookieName);
  try {
    const token = getCookie(req, cookieName);
    if (!token) {
      throw createHttpError(HttpStatus.BAD_REQUEST, 'Refresh token not found in cookie');
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      throw createHttpError(HttpStatus.FORBIDDEN, 'Invalid refresh token');
    }

    return decoded.id as string;
  } catch (error) {
    logger.error('Error in getIdFromCookie:', error);
    throw error; // Propagate the error to be handled by the caller
  }
};