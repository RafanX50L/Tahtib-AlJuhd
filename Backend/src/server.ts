import app from "./app";
import { env } from "./config/env.config";
import { connectDb } from "./config/mongo.config";
import { connectRedis } from "./config/redis.config";
import { socketconfig } from "./SocketSetup/socket";

const startServer = async () => {
    await connectRedis();
    await connectDb();
    const server = app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`);
    });

    socketconfig(server);
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
});

