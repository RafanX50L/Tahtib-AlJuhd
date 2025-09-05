import { Server } from "socket.io";
import handleSocket from "./handleSocket";
// import { socketusecases } from "../config/dependencies";
export function socketconfig(server) {
    const io = new Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        const handlesocket = new handleSocket(io); // handleSocketusecases when needed
        console.log("socket conntected success", socket === null || socket === void 0 ? void 0 : socket.id);
        handlesocket.registerEvent(socket);
    });
}
//# sourceMappingURL=socket.js.map