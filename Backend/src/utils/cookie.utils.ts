import { env } from '../config/env.config';
import { Response, Request } from 'express';

export const setCookie = (res: Response, refreshToken: string) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
};

export const getCookie = (req: Request, name: string): string | undefined => {
  return req.cookies?.[name]; // Requires cookie-parser middleware
};

export const deleteCookie = (res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
};
