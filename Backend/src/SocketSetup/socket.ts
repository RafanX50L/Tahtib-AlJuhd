import { Server } from "socket.io";
import http from "http";
import handleSocket from "./handleSocket";
// import { socketusecases } from "../config/dependencies";

export function socketconfig(server: http.Server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    const handlesocket = new handleSocket(io);// handleSocketusecases when needed
    console.log("socket conntected success", socket?.id);

    handlesocket.registerEvent(socket);
  });
}
