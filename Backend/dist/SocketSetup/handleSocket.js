"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatEnum_1 = require("../constants/chatEnum");
const trainer_clients_service_1 = require("../Services/trainer/trainer.clients.service");
const Chat_repository_1 = require("../Repository/Chat.repository");
const TrainerClientContract_repository_1 = require("../Repository/TrainerClientContract.repository");
const UserFile_repository_1 = require("../Repository/UserFile.repository");
const Notification_repository_1 = require("../Repository/Notification.repository");
const Notification_service_1 = require("../Services/shared/Notification.service");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
class SocketHandler {
    io;
    trainerService;
    notificationService;
    _contractRepo;
    _chatRepo;
    _userfileRepo;
    _notificationRepo;
    constructor(io) {
        this.io = io;
        this._contractRepo = new TrainerClientContract_repository_1.TrainerClientContractRepository();
        this._chatRepo = new Chat_repository_1.ChatRepository();
        this._userfileRepo = new UserFile_repository_1.UserFileRepository();
        this._notificationRepo = new Notification_repository_1.NotificationRepository();
        this.trainerService = new trainer_clients_service_1.TrainerClientService(this._contractRepo, this._chatRepo, this._userfileRepo);
        this.notificationService = new Notification_service_1.NotificationService(this._notificationRepo);
    }
    registerEvent(socket) {
        // Join user-specific and role-based rooms for notifications
        socket.on(chatEnum_1.chatEvents.joinUser, ({ userId, role }) => {
            socket.join(`user_${userId}`);
            socket.join(`${role}_${userId}`);
            logger_utils_1.default.info(`User ${userId} (${role}) joined rooms: user_${userId}, ${role}_${userId}`);
        });
        // Handle notifications
        socket.on(chatEnum_1.chatEvents.sendNotification, async ({ sender, receiver, role, text, category, }) => {
            logger_utils_1.default.info(`Notification from ${sender} to ${receiver || role}: ${text}`);
            try {
                const notification = await this.notificationService.createNotification({
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
                    socket.to(`user_${receiver}`).emit(chatEnum_1.chatEvents.receiveNotification, notificationDto);
                    logger_utils_1.default.info(`Notification emitted to user_${receiver}`);
                }
                else if (role) {
                    socket.to(`${role}_${receiver}`).emit(chatEnum_1.chatEvents.receiveNotification, notificationDto);
                    logger_utils_1.default.info(`Notification emitted to ${role}_${receiver}`);
                }
            }
            catch (error) {
                logger_utils_1.default.error("Error in sendNotification:", error);
                socket.emit(chatEnum_1.chatEvents.error, error.message || "Failed to send notification");
            }
        });
        // Handle form submission notifications (e.g., for admin)
        socket.on("SubmitForm", async ({ senderId, recipientId, message, type, }) => {
            logger_utils_1.default.info(`Form submission notification from ${senderId}: ${message}`);
            try {
                const notification = await this.notificationService.createNotification({
                    senderId,
                    recipientId,
                    message,
                    type,
                });
                if (recipientId) {
                    socket.to(`user_${recipientId}`).emit("adminNotification", notification);
                    logger_utils_1.default.info(`Admin notification emitted to user_${recipientId}`);
                }
            }
            catch (error) {
                logger_utils_1.default.error("Error in SubmitForm:", error);
                socket.emit(chatEnum_1.chatEvents.error, error.message || "Failed to send admin notification");
            }
        });
        // Chat-related events
        socket.on(chatEnum_1.chatEvents.sendMessage, async ({ chatId, sender, text }) => {
            logger_utils_1.default.info(`Received message for chat ${chatId} from ${sender}: ${text}`);
            try {
                const message = await this.trainerService.sendMessage(chatId, sender, text);
                socket.to(chatId).emit(chatEnum_1.chatEvents.receive, message);
                logger_utils_1.default.info(`Message emitted to other sockets in chat ${chatId}`);
            }
            catch (error) {
                logger_utils_1.default.error("Error in handleSendMessage:", error);
                socket.emit(chatEnum_1.chatEvents.error, error.message || "Failed to send message");
            }
        });
        socket.on(chatEnum_1.chatEvents.joinChat, (chatId) => {
            socket.join(chatId);
            logger_utils_1.default.info(`User ${socket.id} joined chat ${chatId}`);
            socket.to(chatId).emit(chatEnum_1.chatEvents.joined, { userId: socket.id });
        });
        // Video call-related events
        socket.on(chatEnum_1.chatEvents.joinRoom, async (room) => {
            try {
                this.handleJoinRoom(socket, room);
            }
            catch (error) {
                logger_utils_1.default.error("Error joining room:", error);
                socket.emit(chatEnum_1.chatEvents.error, error.message || "An error occurred");
            }
        });
        socket.on(chatEnum_1.chatEvents.joinmeet, async (room, email, username) => {
            try {
                this.handleJoinRoom(socket, { roomId: room, username, email });
            }
            catch (error) {
                logger_utils_1.default.error("Error in joinmeet:", error);
                socket.emit(chatEnum_1.chatEvents.error, error.message || "An error occurred");
            }
        });
    }
    handleJoinRoom(socket, room) {
        try {
            socket.on("leave-room", async (data) => {
                socket.leave(data.roomId);
                if (room.username) {
                    socket.to(data.roomId).emit("u-disconnect", room.username);
                }
            });
            socket.join(room.roomId);
            socket.emit(chatEnum_1.chatEvents.joined, { id: socket.id, room });
            socket.broadcast.to(room.roomId).emit(chatEnum_1.chatEvents.userConnected, {
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
            logger_utils_1.default.error("Error in handleJoinRoom:", error);
            socket.emit(chatEnum_1.chatEvents.error, error.message || "Failed to join room");
        }
    }
    handleVidoconnection(socket, room) {
        socket.on(chatEnum_1.chatEvents.videoState, (data) => {
            socket.broadcast.to(room.roomId).emit(chatEnum_1.chatEvents.videoState, {
                email: room.email,
                username: room.username,
                enabled: data.enabled,
            });
        });
        socket.on(chatEnum_1.chatEvents.audioState, (data) => {
            socket.broadcast.to(room.roomId).emit(chatEnum_1.chatEvents.audioState, {
                email: room.email,
                username: room.username,
                enabled: data.enabled,
            });
        });
        socket.on(chatEnum_1.chatEvents.error, (data) => {
            this.io.to(data.to).emit(chatEnum_1.chatEvents.error, { message: data.message });
        });
        socket.on(chatEnum_1.chatEvents.signal, (data) => {
            if (data.to !== socket.id) {
                this.io.to(data.to).emit(chatEnum_1.chatEvents.signal, {
                    ...data,
                    from: socket.id,
                });
            }
        });
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=handleSocket.js.map