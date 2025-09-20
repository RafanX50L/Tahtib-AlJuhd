import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import logger from './logger.utils';

const ACCESS_KEY = env.JWT_ACCESS_SECRET as string;
const REFRESH_KEY = env.JWT_REFRESH_SECRET as string;

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_KEY, { 
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_KEY, { 
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

export function verifyAccessToken(token: string) {
  try {
    const decode = jwt.verify(token, ACCESS_KEY, { algorithms: ['HS256'] });
    logger.debug('Access Data decoded', decode);
    return decode;
  } catch (err) {
    logger.error("Access token verification failed:", err);
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_KEY, { algorithms: ['HS256'] });
  } catch (err) {
    logger.error("Refresh token verification failed:", err);
    return null;
  }
}

export function decodeAndVerifyToken(token: string): Record<string, {_id:string}> | null {
  try {
    const decoded = jwt.verify(token, ACCESS_KEY, { algorithms: ['HS256'] });
    return typeof decoded === 'object' && decoded !== null ? decoded : null;
  } catch (err) {
    logger.error("Token verification failed:", err);
    return null;
  }
}