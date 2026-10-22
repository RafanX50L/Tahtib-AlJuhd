import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import { env } from './env.config';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Must be false for port 587 (uses STARTTLS)
  auth: {
    user: env.SENDER_EMAIL,
    pass: env.PASSKEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10s max connection attempt
  greetingTimeout: 5000,
  socketTimeout: 15000,
});