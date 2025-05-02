import { env } from "../config/env.config";

export const validateEnv = () => {
    if(!env.PORT){
        throw new Error("PORT is not defined in the environment variables");
    }
    if(!env.MONGO_URI){
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    if(!env.JWT_ACCESS_SECRET){
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
    }
    if(!env.JWT_REFRESH_SECRET){
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }
    if(!env.CLIENT_URL){
        throw new Error("CLIENT_URL is not defined in the environment variables");
    }
    if(!env.SENDER_EMAIL){
        throw new Error("SENDER_EMAIL is not defined in the environment variables");
    }
    if(!env.PASSKEY){
        throw new Error("PASSKEY is not defined in the environment variables");
    }
    if(!env.REDIS_URL){
        throw new Error("REDIS_URL is not defined in the environment variables");
    }
    if(!env.NODE_ENV){
        throw new Error("NODE_ENV is not defined in the environment variables");
    }
};