import { Server, Socket } from "socket.io";
import { chatEnum } from "@/constants/chatEnum";
import { TrainerClientService } from "@/Services/trainer/trainer.clients.service";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { IChatRepository } from "@/core/interface/repositories/IChat.repository";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { ChatRepository } from "@/Repository/Chat.repository";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";
import { NotificationRepository } from "@/Repository/Notification.repository";
import { INotificationRepository } from "@/core/interface/repositories/INotification.repository";
import { NotificationService } from "@/Services/shared/Notification.service";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";
import { INotificationView } from "@/dtos/shared/NotificationDTO";

export default class SocketHandler {
  private trainerService: TrainerClientService;
  private notificationService: INotificationService;
  private _contractRepo: ITrainerClientContractRepository;
  private _chatRepo: IChatRepository;
  private _userfileRepo: IUserFileRepository;
  private _notificationRepo: INotificationRepository;

  constructor(private io: Server) {
    this._contractRepo = new TrainerClientContractRepository();
    this._chatRepo = new ChatRepository();
    this._userfileRepo = new UserFileRepository();
    this._notificationRepo = new NotificationRepository();

    this.trainerService = new TrainerClientService(
      this._contractRepo,
      this._chatRepo,
      this._userfileRepo
    );
    this.notificationService = new NotificationService(this._notificationRepo);
  }

  public registerEvent(socket: Socket) {
    // Join user-specific and role-based rooms for notifications
    socket.on(
      chatEnum.joinUser,
      ({ userId, role }: { userId: string; role: string }) => {
        socket.join(`user_${userId}`);
        socket.join(`${role}_${userId}`);
        console.log(`User ${userId} (${role}) joined rooms: user_${userId}, ${role}_${userId}`);
      }
    );

    // Handle notifications
    socket.on(
      chatEnum.sendNotification,
      async ({
        sender,
        receiver,
        role,
        text,
        category,
      }: {
        sender: string;
        receiver?: string;
        role?: string;
        text: string;
        category: string;
      }) => {
        console.log(`Notification from ${sender} to ${receiver || role}: ${text}`);
        try {
          const notification = await this.notificationService.createNotification({
            senderId: sender,
            recipientId: receiver,
            recipientRole: role,
            message:text,
            type:category,
          });
          const notificationDto: INotificationView = {
            id: notification.id,
            sender: notification.senderId,
            receiver: notification.recipientId,
            text: notification.message,
            category: notification.type,
            isRead: notification.read,
            date: notification.createdAt,
          };
          if (receiver) {
            socket.to(`user_${receiver}`).emit(chatEnum.receiveNotification, notificationDto);
            console.log(`Notification emitted to user_${receiver}`);
          } else if (role) {
            socket.to(`${role}_${receiver}`).emit(chatEnum.receiveNotification, notificationDto);
            console.log(`Notification emitted to ${role}_${receiver}`);
          }
        } catch (error) {
          console.error("Error in sendNotification:", error);
          socket.emit(chatEnum.error, error.message || "Failed to send notification");
        }
      }
    );

    // Handle form submission notifications (e.g., for admin)
    socket.on(
      "SubmitForm",
      async ({
        senderId,
        recipientId,
        message,
        type,
      }: {
        senderId: string;
        recipientId?: string;
        message: string;
        type: string;
      }) => {
        console.log(`Form submission notification from ${senderId}: ${message}`);
        try {
          const notification = await this.notificationService.createNotification({
            senderId,
            recipientId,
            message,
            type,
          });
          if (recipientId) {
            socket.to(`user_${recipientId}`).emit("adminNotification", notification);
            console.log(`Admin notification emitted to user_${recipientId}`);
          }
        } catch (error) {
          console.error("Error in SubmitForm:", error);
          socket.emit(chatEnum.error, error.message || "Failed to send admin notification");
        }
      }
    );

    // Chat-related events
    socket.on(
      chatEnum.sendMessage,
      async ({ chatId, sender, text }: { chatId: string; sender: string; text: string }) => {
        console.log(`Received message for chat ${chatId} from ${sender}: ${text}`);
        try {
          const message = await this.trainerService.sendMessage(chatId, sender, text);
          socket.to(chatId).emit(chatEnum.receive, message);
          console.log(`Message emitted to other sockets in chat ${chatId}`);
        } catch (error) {
          console.error("Error in handleSendMessage:", error);
          socket.emit(chatEnum.error, error.message || "Failed to send message");
        }
      }
    );

    socket.on(chatEnum.joinChat, (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
      socket.to(chatId).emit(chatEnum.joined, { userId: socket.id });
    });

    // Video call-related events
    socket.on(
      chatEnum.joinRoom,
      async (room: { roomId: string; username: string; email: string }) => {
        try {
          this.handleJoinRoom(socket, room);
        } catch (error) {
          console.error("Error joining room:", error);
          socket.emit(chatEnum.error, error.message || "An error occurred");
        }
      }
    );

    socket.on(
      chatEnum.joinmeet,
      async (room: string, email: string, username: string) => {
        try {
          this.handleJoinRoom(socket, { roomId: room, username, email });
        } catch (error) {
          console.error("Error in joinmeet:", error);
          socket.emit(chatEnum.error, error.message || "An error occurred");
        }
      }
    );
  }

  private handleJoinRoom(
    socket: Socket,
    room: { roomId: string; username: string; email: string }
  ): void {
    try {
      socket.on("leave-room", async (data) => {
        socket.leave(data.roomId);
        if (room.username) {
          socket.to(data.roomId).emit("u-disconnect", room.username);
        }
      });

      socket.join(room.roomId);
      socket.emit(chatEnum.joined, { id: socket.id, room });
      socket.broadcast.to(room.roomId).emit(chatEnum.userConnected, {
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
    } catch (error) {
      console.error("Error in handleJoinRoom:", error);
      socket.emit(chatEnum.error, error.message || "Failed to join room");
    }
  }

  private handleVidoconnection(
    socket: Socket,
    room: { roomId: string; username: string; email: string }
  ) {
    socket.on(chatEnum.videoState, (data) => {
      socket.broadcast.to(room.roomId).emit(chatEnum.videoState, {
        email: room.email,
        username: room.username,
        enabled: data.enabled,
      });
    });

    socket.on(chatEnum.audioState, (data) => {
      socket.broadcast.to(room.roomId).emit(chatEnum.audioState, {
        email: room.email,
        username: room.username,
        enabled: data.enabled,
      });
    });

    socket.on(chatEnum.error, (data) => {
      this.io.to(data.to).emit(chatEnum.error, { message: data.message });
    });

    socket.on(chatEnum.signal, (data) => {
      if (data.to !== socket.id) {
        this.io.to(data.to).emit(chatEnum.signal, {
          ...data,
          from: socket.id,
        });
      }
    });
  }
}