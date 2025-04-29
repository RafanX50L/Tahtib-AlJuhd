import dotenv from 'dotenv';
dotenv.config();

export const env = {
    get PORT() {
        return Number(process.env.PORT) || 5000;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";
    },
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_ACCESS_SECRET;
    },
    get JWT_REFRESH_SECRET() {
        return process.env.JWT_REFRESH_SECRET;
    },
    get CLIENT_URL() {
        return process.env.CLIENT_URL || "http://localhost:5173";
    }
};