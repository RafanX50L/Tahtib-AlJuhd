"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const env_config_1 = require("../config/env.config");
// List of valid AWS regions
const VALID_AWS_REGIONS = [
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "ap-south-1",
    "ap-south-2",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "eu-west-1",
    "eu-west-2",
    "eu-west-3",
    "eu-central-1",
];
const validateEnv = () => {
    if (!env_config_1.env.PORT) {
        throw new Error("PORT is not defined in the environment variables");
    }
    if (!env_config_1.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    if (!env_config_1.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
    }
    if (!env_config_1.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }
    if (!env_config_1.env.CLIENT_URL) {
        throw new Error("CLIENT_URL is not defined in the environment variables");
    }
    if (!env_config_1.env.SENDER_EMAIL) {
        throw new Error("SENDER_EMAIL is not defined in the environment variables");
    }
    if (!env_config_1.env.PASSKEY) {
        throw new Error("PASSKEY is not defined in the environment variables");
    }
    if (!env_config_1.env.REDIS_URL) {
        throw new Error("REDIS_URL is not defined in the environment variables");
    }
    if (!env_config_1.env.NODE_ENV) {
        throw new Error("NODE_ENV is not defined in the environment variables");
    }
    if (!env_config_1.env.RESET_PASS_URL) {
        throw new Error("RESET_PASS_URL is not defined in the environment variables");
    }
    if (!env_config_1.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API is not defined in the evironment variables");
    }
    if (!VALID_AWS_REGIONS.includes(env_config_1.env.AWS_REGION)) {
        throw new Error(`Invalid AWS_REGION: ${env_config_1.env.AWS_REGION}. Must be a valid AWS region (e.g., ap-south-2)`);
    }
    if (!env_config_1.env.S3_BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME is not defined in the environment variables");
    }
    if (!env_config_1.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS_ACCESS_KEY_ID is not defined in the environment variables");
    }
    if (!env_config_1.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS_SECRET_ACCESS_KEY is not defined in the environment variables");
    }
    if (!env_config_1.env.ERROR_LOG_RETENTION_PERIOD) {
        throw new Error("ERROR_LOG_RETENTION_PERIOD is not defined in the environment variables");
    }
    if (!env_config_1.env.START_INTERVAL) {
        throw new Error("START_INTERVAL is not defined in the environment variables");
    }
    if (!env_config_1.env.END_INTERVAL) {
        throw new Error("END_INTERVAL is not defined in the environment variables");
    }
    if (!env_config_1.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
    }
    if (!env_config_1.env.WEBHOOK_SECRET) {
        throw new Error("WEBHOOK_SECRET is not defined in the environment variables");
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=validate-env.utils.js.map