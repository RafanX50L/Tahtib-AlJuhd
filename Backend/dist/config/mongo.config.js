"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
async function connectDb() {
    const MONGO_URI = env_config_1.env.MONGO_URI;
    try {
        await mongoose_1.default.connect(MONGO_URI);
        logger_utils_1.default.info("MongoDB connected successfully");
    }
    catch (error) {
        logger_utils_1.default.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
//# sourceMappingURL=mongo.config.js.map