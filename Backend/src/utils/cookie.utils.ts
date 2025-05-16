import { env } from '../config/env.config';
import { Response, Request } from 'express';
import { decodeAndVerifyToken } from './jwt.utils';
import { createHttpError } from './http-error.util';
import { HttpStatus } from '../constants/status.constant';


export const setCookie = (res: Response, refreshToken: string) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
};

export const getCookie = (req: Request, name: string): string => {
  return req.cookies?.[name]; // Requires cookie-parser middleware
};

export const deleteCookie = (res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
};

export const getIdFromCookie = (req: Request, cookieName: string): string | null => {
  console.log('enterd in get id form cookiew');
  try {
    const token = getCookie(req,cookieName);
    if(token){
      const decoded = decodeAndVerifyToken(token);
      if(decoded){
        return decoded._id ?? null;
      }else{
        createHttpError(HttpStatus.NOT_FOUND,"Not able to get decoded data");
      }
    }
    return null;
    
  } catch (error) {
    console.error("Invalid or expired token in cookie:", error);
    return null;
  }
};