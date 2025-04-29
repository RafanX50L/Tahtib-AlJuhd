import mongoose from "mongoose";
import {env} from "./env.config";

export async function connectDb() {
    const MONGO_URI = env.MONGO_URI as string;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}