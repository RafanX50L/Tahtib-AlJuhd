import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, createHttpError } from '../utils';
import { HttpResponse } from '../constants/response-message.constant';
import { HttpStatus } from '../constants/status.constant';

export interface userData extends Request {
  user?: {
    id: string;
    role: 'client' | 'admin' | 'trainer';
  };
}

export default function verifyToken(userLevel: 'client' | 'admin' | 'trainer') {
  return (req: userData, res: Response, next: NextFunction): void => {
    console.log('verifyToken middleware called for route:', req.url);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No or invalid Authorization header');
      return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN));
    }

    try {
      const payload = verifyAccessToken(token);

      if (!payload || typeof payload !== 'object') {
        console.log('Invalid payload');
        return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
      }

      const { _id, role } = payload as {
        _id?: string;
        role?: string;
      };

      if (!_id || !role || !['client', 'admin', 'trainer'].includes(role)) {
        console.log('Invalid payload structure or role:', { _id, role });
        return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
      }

      if (role !== userLevel) {
        console.log(`Role mismatch: required ${userLevel}, got ${role}`);
        return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED));
      }

      req.user = { id: _id, role: role as 'client' | 'admin' | 'trainer' };
      req.headers['x-user-payload'] = JSON.stringify({ _id, role });

      next();
    } catch (error: any) {
      console.log('Token verification error:', error.name, error.message);
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED));
      }
      return next(error);
    }
  };
}
