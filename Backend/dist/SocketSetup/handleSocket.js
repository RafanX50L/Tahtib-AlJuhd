var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { chatEvents } from "../constants/chatEnum";
import { TrainerClientService } from "../Services/trainer/trainer.clients.service";
import { ChatRepository } from "../Repository/Chat.repository";
import { TrainerClientContractRepository } from "../Repository/TrainerClientContract.repository";
import { UserFileRepository } from "../Repository/UserFile.repository";
import { NotificationRepository } from "../Repository/Notification.repository";
import { NotificationService } from "../Services/shared/Notification.service";
export default class SocketHandler {
    constructor(io) {
        this.io = io;
        this._contractRepo = new TrainerClientContractRepository();
        this._chatRepo = new ChatRepository();
        this._userfileRepo = new UserFileRepository();
        this._notificationRepo = new NotificationRepository();
        this.trainerService = new TrainerClientService(this._contractRepo, this._chatRepo, this._userfileRepo);
        this.notificationService = new NotificationService(this._notificationRepo);
    }
    registerEvent(socket) {
        // Join user-specific and role-based rooms for notifications
        socket.on(chatEvents.joinUser, ({ userId, role }) => {
            socket.join(`user_${userId}`);
            socket.join(`${role}_${userId}`);
            console.log(`User ${userId} (${role}) joined rooms: user_${userId}, ${role}_${userId}`);
        });
        // Handle notifications
        socket.on(chatEvents.sendNotification, (_a) => __awaiter(this, [_a], void 0, function* ({ sender, receiver, role, text, category, }) {
            console.log(`Notification from ${sender} to ${receiver || role}: ${text}`);
            try {
                const notification = yield this.notificationService.createNotification({
                    senderId: sender,
                    recipientId: receiver,
                    recipientRole: role,
                    message: text,
                    type: category,
                });
                const notificationDto = {
                    id: notification.id,
                    sender: notification.senderId,
                    receiver: notification.recipientId,
                    text: notification.message,
                    category: notification.type,
                    isRead: notification.read,
                    date: notification.createdAt,
                };
                if (receiver) {
                    socket.to(`user_${receiver}`).emit(chatEvents.receiveNotification, notificationDto);
                    console.log(`Notification emitted to user_${receiver}`);
                }
                else if (role) {
                    socket.to(`${role}_${receiver}`).emit(chatEvents.receiveNotification, notificationDto);
                    console.log(`Notification emitted to ${role}_${receiver}`);
                }
            }
            catch (error) {
                console.error("Error in sendNotification:", error);
                socket.emit(chatEvents.error, error.message || "Failed to send notification");
            }
        }));
        // Handle form submission notifications (e.g., for admin)
        socket.on("SubmitForm", (_a) => __awaiter(this, [_a], void 0, function* ({ senderId, recipientId, message, type, }) {
            console.log(`Form submission notification from ${senderId}: ${message}`);
            try {
                const notification = yield this.notificationService.createNotification({
                    senderId,
                    recipientId,
                    message,
                    type,
                });
                if (recipientId) {
                    socket.to(`user_${recipientId}`).emit("adminNotification", notification);
                    console.log(`Admin notification emitted to user_${recipientId}`);
                }
            }
            catch (error) {
                console.error("Error in SubmitForm:", error);
                socket.emit(chatEvents.error, error.message || "Failed to send admin notification");
            }
        }));
        // Chat-related events
        socket.on(chatEvents.sendMessage, (_a) => __awaiter(this, [_a], void 0, function* ({ chatId, sender, text }) {
            console.log(`Received message for chat ${chatId} from ${sender}: ${text}`);
            try {
                const message = yield this.trainerService.sendMessage(chatId, sender, text);
                socket.to(chatId).emit(chatEvents.receive, message);
                console.log(`Message emitted to other sockets in chat ${chatId}`);
            }
            catch (error) {
                console.error("Error in handleSendMessage:", error);
                socket.emit(chatEvents.error, error.message || "Failed to send message");
            }
        }));
        socket.on(chatEvents.joinChat, (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
            socket.to(chatId).emit(chatEvents.joined, { userId: socket.id });
        });
        // Video call-related events
        socket.on(chatEvents.joinRoom, (room) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.handleJoinRoom(socket, room);
            }
            catch (error) {
                console.error("Error joining room:", error);
                socket.emit(chatEvents.error, error.message || "An error occurred");
            }
        }));
        socket.on(chatEvents.joinmeet, (room, email, username) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.handleJoinRoom(socket, { roomId: room, username, email });
            }
            catch (error) {
                console.error("Error in joinmeet:", error);
                socket.emit(chatEvents.error, error.message || "An error occurred");
            }
        }));
    }
    handleJoinRoom(socket, room) {
        try {
            socket.on("leave-room", (data) => __awaiter(this, void 0, void 0, function* () {
                socket.leave(data.roomId);
                if (room.username) {
                    socket.to(data.roomId).emit("u-disconnect", room.username);
                }
            }));
            socket.join(room.roomId);
            socket.emit(chatEvents.joined, { id: socket.id, room });
            socket.broadcast.to(room.roomId).emit(chatEvents.userConnected, {
                email: room.email,
                id: socket.id,
                username: room.username,
                message: `${room.username} Joined`,
            });
            this.handleVidoconnection(socket, room);
            socket.on("disconnect", () => {
                if (room && room.roomId) {
                    socket.to(room.roomId).emit("u-disconnect", room.username);
                }
            });
        }
        catch (error) {
            console.error("Error in handleJoinRoom:", error);
            socket.emit(chatEvents.error, error.message || "Failed to join room");
        }
    }
    handleVidoconnection(socket, room) {
        socket.on(chatEvents.videoState, (data) => {
            socket.broadcast.to(room.roomId).emit(chatEvents.videoState, {
                email: room.email,
                username: room.username,
                enabled: data.enabled,
            });
        });
        socket.on(chatEvents.audioState, (data) => {
            socket.broadcast.to(room.roomId).emit(chatEvents.audioState, {
                email: room.email,
                username: room.username,
                enabled: data.enabled,
            });
        });
        socket.on(chatEvents.error, (data) => {
            this.io.to(data.to).emit(chatEvents.error, { message: data.message });
        });
        socket.on(chatEvents.signal, (data) => {
            if (data.to !== socket.id) {
                this.io.to(data.to).emit(chatEvents.signal, Object.assign(Object.assign({}, data), { from: socket.id }));
            }
        });
    }
}
//# sourceMappingURL=handleSocket.js.map