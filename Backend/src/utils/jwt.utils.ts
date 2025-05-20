import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';

const ACCESS_KEY = env.JWT_ACCESS_SECRET as string;
const REFRESH_KEY =env.JWT_REFRESH_SECRET as string;

const ACCESS_TOKEN_EXPIRY = "1m";
const REFRESH_TOKEN_EXPIRY = "5m";

export function generateAccessToken(payload:object):string{
    return jwt.sign(payload,ACCESS_KEY,{expiresIn:ACCESS_TOKEN_EXPIRY});
}

export function generateRefreshToken(payload:object):string{
    return jwt.sign(payload,REFRESH_KEY,{expiresIn:REFRESH_TOKEN_EXPIRY});
}

export function verifyAccessToken(token:string){
        console.log('step 3');
    try{
        return jwt.verify(token,ACCESS_KEY);
    }catch(err){
            console.log('step 4');

        console.error(err);
        return null;
    }
}

export function verifyRefreshToken(token:string){
    try{
        return jwt.verify(token,REFRESH_KEY);
    }catch(err){
        console.log(err);
        return null;
    }
}

export function decodeAndVerifyToken(token: string): Record<string, null> | null {
  try {
    const decoded = jwt.verify(token, ACCESS_KEY);
    return typeof decoded === 'object' && decoded !== null ? decoded : null;
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
}