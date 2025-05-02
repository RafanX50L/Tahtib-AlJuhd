import { createClient, RedisClientType } from 'redis';
import { env } from './env.config';

let redisClient: RedisClientType ;

async function connectRedis() {

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

    await redisClient.connect();
    console.log('Connected to Redis successfully');
};

export {connectRedis, redisClient};