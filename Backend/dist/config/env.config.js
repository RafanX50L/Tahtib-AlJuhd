import dotenv from "dotenv";
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
        return process.env.NODE_ENV;
    },
    get RESET_PASS_URL() {
        return process.env.RESET_PASS_URL;
    },
    get GEMINI_API_KEY() {
        return process.env.GEMINI_API;
    },
    get AWS_REGION() {
        return process.env.AWS_REGION;
    },
    get S3_BUCKET_NAME() {
        return process.env.S3_BUCKET_NAME;
    },
    get AWS_ACCESS_KEY_ID() {
        return process.env.AWS_ACCESS_KEY_ID;
    },
    get AWS_SECRET_ACCESS_KEY() {
        return process.env.AWS_SECRET_ACCESS_KEY;
    },
    get TRAINER_DASHBOARD_URL() {
        return process.env.TRAINER_DASHBOARD_URL;
    },
    get ERROR_LOG_RETENTION_PERIOD() {
        return process.env.ERROR_LOG_RETENTION_PERIOD;
    },
    get START_INTERVAL() {
        return process.env.START_INTERVAL;
    },
    get END_INTERVAL() {
        return process.env.END_INTERVAL;
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY;
    }
};
//# sourceMappingURL=env.config.js.map