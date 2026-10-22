import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();
import { env } from './env.config';
import logger from '../utils/logger.utils';

if (!env.RESEND_API_KEY || env.RESEND_API_KEY === 'your_resend_api_key_here') {
  logger.warn('[Resend Config] RESEND_API_KEY is missing or set to placeholder value. Set RESEND_API_KEY in your .env file.');
}

export const resend = new Resend(env.RESEND_API_KEY);