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
    console.log('verifyToken middleware called for route:', req.url);

    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No or invalid Authorization header');
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
      console.log('No token provided');
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
    }

    try {
      const payload = verifyAccessToken(token);
      console.log('Token payload:', payload);

      if (!payload || typeof payload !== 'object') {
        console.log('Invalid payload');
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }

      // Validate payload shape
      const { _id, role } = payload as {
        _id?: string;
        role?: string;
      };

      if (!_id || !role || !['client', 'admin', 'trainer'].includes(role)) {
        console.log('Invalid payload structure or role:', { _id, role });
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }

      if (role !== userLevel) {
        console.log(`Role mismatch: required ${userLevel}, got ${role}`);
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.UNAUTHORIZED);
      }

      req.user = { id:_id, role: role as 'client' | 'admin' | 'trainer' };
      req.headers['x-user-payload'] = JSON.stringify({ _id, role });
      // console.log('User data set:', req.user, 'Headers:', req.headers);

      next();
    } catch (error: any) {
      console.log('Token verification error:', error.name, error.message);
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
      }
      throw error;
    }
  };
}