var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from "./app";
import { env } from "./config/env.config";
import { connectDb } from "./config/mongo.config";
import { connectRedis } from "./config/redis.config";
import { socketconfig } from "./SocketSetup/socket";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectRedis();
    yield connectDb();
    const server = app.listen(env.PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${env.PORT}`);
    });
    socketconfig(server);
});
startServer().catch((error) => {
    console.error("Error starting server:", error);
});
//# sourceMappingURL=server.js.map