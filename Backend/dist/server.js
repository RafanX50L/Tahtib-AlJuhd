"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const mongo_config_1 = require("./config/mongo.config");
const redis_config_1 = require("./config/redis.config");
const socket_1 = require("./SocketSetup/socket");
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
const startServer = async () => {
    await (0, redis_config_1.connectRedis)();
    await (0, mongo_config_1.connectDb)();
    const server = app_1.default.listen(env_config_1.env.PORT, "0.0.0.0", () => {
        logger_utils_1.default.info(`Server is running on port ${env_config_1.env.PORT}`);
    });
    (0, socket_1.socketconfig)(server);
};
startServer().catch((error) => {
    logger_utils_1.default.error("Error starting server:", error);
});
//# sourceMappingURL=server.js.map