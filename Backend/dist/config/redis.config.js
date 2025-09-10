"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const env_config_1 = require("./env.config");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
let redisClient;
async function connectRedis() {
    exports.redisClient = redisClient = (0, redis_1.createClient)({
        url: env_config_1.env.REDIS_URL,
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 5) {
                    return new Error('Max retries reached. Exiting...');
                }
                return Math.min(retries * 100, 2000);
            },
        },
    });
    redisClient.on('conect', () => {
        console.log('Redis client connected');
    });
    redisClient.on('error', (err) => {
        console.error('Redis client error:', err);
    });
    await redisClient.connect();
    logger_utils_1.default.info('Connected to Redis successfully');
}
;
//# sourceMappingURL=redis.config.js.map