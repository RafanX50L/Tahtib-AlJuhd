
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils';
import { HttpResponse } from '../constants/response-message.constant';
import { HttpStatus } from '../constants/status.constant';
import { createHttpError } from '../utils';

export interface userData extends Request {
  user?: {
    id: string;
    role: 'client' | 'admin' | 'trainer';
  };
}

export default function verifyToken(userLevel: 'client' | 'admin' | 'trainer') {
  return (req: userData, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
    }

    try {
      const payload = verifyAccessToken(token);
      console.log(payload);
      if (!payload || typeof payload !== 'object') {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }

      // Validate payload shape
      const { id, role } = payload as {
        id?: string;
        role?: string;
      };
      if (!id ||     !role || !['user', 'admin', 'moderator'].includes(role)) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }

      if (role !== userLevel) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED);
      }

      req.user = { id, role };
      req.headers['x-user-payload'] = JSON.stringify({ id, role });
      console.log(req.user,req.headers);

      next();
    } catch (error:any) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }
      if (error.name === 'JsonWebTokenError') {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }
      throw error; // Re-throw unexpected errors
    }
  };
}