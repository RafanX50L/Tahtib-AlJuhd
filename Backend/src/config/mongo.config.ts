import mongoose from "mongoose";
import {env} from "./env.config";
import logger from "../utils/logger.utils";

export async function connectDb() {
    const MONGO_URI = env.MONGO_URI as string;
    try {
        await mongoose.connect(MONGO_URI);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
}