import app from "./app";
import { env } from "./config/env.config";
import { connectDb } from "./config/mongo.config";
import { connectRedis } from "./config/redis.config";
import { socketconfig } from "./SocketSetup/socket";
import logger from "./utils/logger.utils";

const startServer = async () => {
  await connectRedis();
  await connectDb();
  const server = app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });

  socketconfig(server);
};

startServer().catch((error) => {
  logger.error("Error starting server:", error);
});
