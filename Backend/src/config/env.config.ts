import dotenv from 'dotenv';
dotenv.config();

export const env = {
    get PORT() {
        return Number(process.env.PORT) || 5000;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_ACCESS_SECRET;
    },
    get JWT_REFRESH_SECRET() {
        return process.env.JWT_REFRESH_SECRET;
    },
    get CLIENT_URL() {
        return process.env.CLIENT_URL;
    },
    get SENDER_EMAIL() {
        return process.env.SENDER_EMAIL;
    },
    get PASSKEY() {
        return process.env.PASSKEY;
    },
    get REDIS_URL() {
        return process.env.REDIS_URL;
    },
    get NODE_ENV() {
        return process.env.NODE_ENV ;
    },
    get RESET_PASS_URL() { 
        return process.env.RESET_PASS_URL;
    }   
};