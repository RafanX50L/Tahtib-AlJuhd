// import { chatEnum } from "@/constants/chatEnum";
// import { Server, Socket } from "socket.io";

// export default class HandleSocket {
//   constructor(private io: Server) {}

//   public registerEvent(socket: Socket) {
//     socket.on("sendNotification", (data) => {
//       this.io.emit("receiveNotification", data);
//     });
//     socket.on("SubmitForm", (data) => {
//       this.io.emit("adminNotification", data);
//     });
//     socket.on(
//       chatEnum.joinRoom,
//       async (room: { roomId: string; username: string; email: string }) => {
//         try {
//         //   const res = await this.socketusecase.validatoinUser(
//         //     room.roomId,
//         //     room.email
//         //   );

//         //   if (res) {
//         //     this.handleJoinRoom(socket, room);
//         //   } else {
//         //     socket.emit(chatEnum.error, "unknown user");
//         //   }
//           this.handleJoinRoom(socket, room);
//         } catch (error) {
//           console.error("Error joining room:", error);
//           socket.emit(chatEnum.error, error.message || "An error occurred");
//         }
//       }
//     );

//     socket.on(chatEnum.joinmeet, async (room, email, username) => {
//       try {
//         // const ans = await this.socketusecase.valiateMeeting(room, email);

//         // if (!ans) {
//         //   socket.emit(chatEnum.error, "Unable to verify");
//         // } else {
//         //   this.handleJoinRoom(socket, { roomId: room, username, email });
//         // }
//         this.handleJoinRoom(socket, { roomId: room, username, email });
//       } catch (error) {
//         console.error("Error in joinmeet:", error);
//         socket.emit(chatEnum.error, error.message || "An error occurred");
//       }
//     });
//   }

//   private handleJoinRoom(
//     socket: Socket,
//     room: { roomId: string; username: string; email: string }
//   ): void {
//     try {
//       socket.on("leave-room", async (data) => {
//         socket.leave(data.roomId);

//         if (room.username) {
//           socket.to(data.roomId).emit("u-disconnect", room.username);
//         }
//         return;
//       });
//       socket.join(room.roomId);

//       socket.emit(chatEnum.joined, { id: socket.id, room });

//       socket.broadcast.to(room.roomId).emit(chatEnum.userConnected, {
//         email: room.email,
//         id: socket.id,
//         username: room.username,
//         message: `${room.username} Joined`,
//       });

//       this.handleVidoconnection(socket, room);
//       socket.removeAllListeners(chatEnum.sendMessage);
//       //   socket.on(
//       //     chatEnum.sendMessage,
//       //     (
//       //       message: string,
//       //       roomId: string,
//       //       userEmail: string,
//       //       username: string
//       //     ) => {

//       //       this.handleSendMessage(socket, {
//       //         roomId,
//       //         message,
//       //         userEmail,
//       //         username,
//       //       });
//       //     }
//       //   );

//       socket.on("disconnect", () => {
//         if (room && room.roomId) {
//           socket.to(room.roomId).emit("u-disconnect", room.username);
//         }
//       });
//     } catch (error) {
//       console.error("Error in handleJoinRoom:", error);
//       socket.emit(chatEnum.error, error.message || "Failed to join room");
//     }
//   }

//   private handleVidoconnection(
//     socket: Socket,
//     room: { roomId: string; username: string; email: string }
//   ) {
//     socket.on(chatEnum.videoState, (data) => {
//       socket.broadcast.to(room.roomId).emit(chatEnum.videoState, {
//         email: room.email,
//         username: room.username,
//         enabled: data.enabled,
//       });
//     });

//     socket.on(chatEnum.audioState, (data) => {
//       socket.broadcast.to(room.roomId).emit(chatEnum.audioState, {
//         email: room.email,
//         username: room.username,
//         enabled: data.enabled,
//       });
//     });

//     socket.on(chatEnum.error, (data:any) => {
//       this.io.to(data.to).emit(chatEnum.error, { message: data.message });
//     });

//     socket.on(chatEnum.signal, (data) => {
//       if (data.to !== socket.id) {
//         this.io.to(data.to).emit(chatEnum.signal, {
//           ...data,
//           from: socket.id,
//         });
//       }
//     });
    
//   }

  //   private async handleSendMessage(
  //     socket: Socket,
  //     {
  //       roomId,
  //       message,
  //       userEmail,
  //       username,
  //     }: { roomId: string; message: string; userEmail: string; username: string }
  //   ): Promise<void> {
  //     try {

  //       const savedMessage = await this.socketusecase.sendMessage(
  //         roomId,
  //         userEmail,
  //         message,
  //         username
  //       );

  //       socket.broadcast.to(roomId).emit(chatEnum.receive, savedMessage);

  //     } catch (error) {
  //       console.error("Error in handleSendMessage:", error);
  //       socket.emit(chatEnum.error, error.message || "Failed to send message");
  //     }
  //   }
// }


// // ```typescript
// // import { Server, Socket } from 'socket.io';
// // import { ChatService } from '../services/ChatService';
// // import { ChatRepository } from '../repositories/ChatRepository';

// // const chatRepo = new ChatRepository();
// // const chatService = new ChatService(chatRepo);

// // export const setupChatSocket = (io: Server) => {
// //   io.on('connection', (socket: Socket) => {
// //     socket.on('joinChat', async (chatId: string) => {
// //       socket.join(chatId);
// //       const chat = await chatService.getChatById(chatId);
// //       if (chat) socket.emit('chatHistory', chat.messages);
// //     });

// //     socket.on('sendMessage', async ({ chatId, senderId, content }) => {
// //       await chatService.addMessage(chatId, senderId, content);
// //       io.to(chatId).emit('newMessage', { senderId, content, timestamp: new Date() });
// //     });
// //   });
// // };
// // ```
import { Server, Socket } from 'socket.io';
import { chatEnum } from '@/constants/chatEnum';
import { TrainerClientService } from '@/Services/trainer/trainer.clients.service'; 
import { ITrainerClientContractRepository } from '@/core/interface/repositories/ITrainerClientContract.repository';
import { IChatRepository } from '@/core/interface/repositories/IChat.repository';
import { IUserFileRepository } from '@/core/interface/repositories/IUserFile.repository';
import { ChatRepository } from "@/Repository/Chat.repository";
import { TrainerClientContractRepository } from "@/Repository/TrainerClientContract.repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";


export default class HandleSocket {
  private trainerService: TrainerClientService;
  private _contractRepo: ITrainerClientContractRepository;
  private _chatRepo: IChatRepository;
  private _userfileRepo: IUserFileRepository;

  constructor(private io: Server) {
  this._contractRepo = new TrainerClientContractRepository();
  this._chatRepo = new ChatRepository();
  this._userfileRepo = new UserFileRepository();

  this.trainerService = new TrainerClientService(
    this._contractRepo,
    this._chatRepo,
    this._userfileRepo
  );
}

  public registerEvent(socket: Socket) {
    socket.on('sendNotification', (data) => {
      this.io.emit('receiveNotification', data);
    });

    socket.on('SubmitForm', (data) => {
      this.io.emit('adminNotification', data);
    });

    socket.on(
      chatEnum.joinRoom,
      async (room: { roomId: string; username: string; email: string }) => {
        try {
          this.handleJoinRoom(socket, room);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit(chatEnum.error, error.message || 'An error occurred');
        }
      }
    );

    socket.on(
      chatEnum.joinmeet,
      async (room: string, email: string, username: string) => {
        try {
          this.handleJoinRoom(socket, { roomId: room, username, email });
        } catch (error) {
          console.error('Error in joinmeet:', error);
          socket.emit(chatEnum.error, error.message || 'An error occurred');
        }
      }
    );

    socket.on(
      chatEnum.sendMessage,
      async ({ chatId, senderId, text }: { chatId: string; senderId: string; text: string }) => {
        console.log('Sending message:', { chatId, senderId, text });
        try {
          const message = await this.trainerService.sendMessage(chatId, senderId, text);
          this.io.to(chatId).emit(chatEnum.receive, message);
        } catch (error) {
          console.error('Error in handleSendMessage:', error);
          socket.emit(chatEnum.error, error.message || 'Failed to send message');
        }
      }
    );
  }

  private handleJoinRoom(
    socket: Socket,
    room: { roomId: string; username: string; email: string }
  ): void {
    try {
      socket.on('leave-room', async (data) => {
        socket.leave(data.roomId);
        if (room.username) {
          socket.to(data.roomId).emit('u-disconnect', room.username);
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

      socket.on('disconnect', () => {
        if (room && room.roomId) {
          socket.to(room.roomId).emit('u-disconnect', room.username);
        }
      });
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      socket.emit(chatEnum.error, error.message || 'Failed to join room');
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

    socket.on(chatEnum.error, (data:any) => {
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