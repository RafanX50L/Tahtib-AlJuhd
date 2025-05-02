import crypto from 'crypto';
import { START_INTERVAL, END_INTERVAL } from '../constants/otp-intervel.constant';

export const generateOTP = (): string => {
    return crypto.randomInt(START_INTERVAL, END_INTERVAL).toString();
};