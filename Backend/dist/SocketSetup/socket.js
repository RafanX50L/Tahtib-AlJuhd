"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketconfig = socketconfig;
const socket_io_1 = require("socket.io");
const handleSocket_1 = __importDefault(require("./handleSocket"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// import { socketusecases } from "../config/dependencies";
function socketconfig(server) {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        const handlesocket = new handleSocket_1.default(io); // handleSocketusecases when needed
        logger_utils_1.default.info("socket connected success", socket?.id);
        handlesocket.registerEvent(socket);
    });
}
//# sourceMappingURL=socket.js.map