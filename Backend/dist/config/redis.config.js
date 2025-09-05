var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from 'redis';
import { env } from './env.config';
import logger from '../utils/logger.utils';
let redisClient;
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        redisClient = createClient({
            url: env.REDIS_URL,
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
        yield redisClient.connect();
        logger.info('Connected to Redis successfully');
    });
}
;
export { connectRedis, redisClient };
//# sourceMappingURL=redis.config.js.map