import { chatEnum } from "@/constants/chatEnum";
import { Server, Socket } from "socket.io";

export default class HandleSocket {
  constructor(private io: Server) {}

  public registerEvent(socket: Socket) {
    console.log('enterd to soket handling');
    socket.on("sendNotification", (data) => {
      this.io.emit("receiveNotification", data);
    });
    socket.on("SubmitForm", (data) => {
      this.io.emit("adminNotification", data);
    });
    socket.on(
      chatEnum.joinRoom,
      async (room: { roomId: string; username: string; email: string }) => {
          console.log('userconnected',room.roomId,room.username);
        try {
        //   const res = await this.socketusecase.validatoinUser(
        //     room.roomId,
        //     room.email
        //   );

        //   if (res) {
        //     this.handleJoinRoom(socket, room);
        //   } else {
        //     socket.emit(chatEnum.error, "unknown user");
        //   }
          this.handleJoinRoom(socket, room);
        } catch (error: any) {
          console.error("Error joining room:", error);
          socket.emit(chatEnum.error, error.message || "An error occurred");
        }
      }
    );

    socket.on(chatEnum.joinmeet, async (room, email, username) => {
        console.log('entered to joinmeet');
      try {
        // const ans = await this.socketusecase.valiateMeeting(room, email);

        // if (!ans) {
        //   socket.emit(chatEnum.error, "Unable to verify");
        // } else {
        //   this.handleJoinRoom(socket, { roomId: room, username, email });
        // }
        this.handleJoinRoom(socket, { roomId: room, username, email });
      } catch (error: any) {
        console.error("Error in joinmeet:", error);
        socket.emit(chatEnum.error, error.message || "An error occurred");
      }
    });
  }

  private handleJoinRoom(
    socket: Socket,
    room: { roomId: string; username: string; email: string }
  ): void {
    try {
      console.log(
        `User ${room.username} is trying to join room: ${room.roomId} ${socket.id}`
      );
      socket.on("leave-room", async (data) => {
        socket.leave(data.roomId);

        if (room.username) {
          socket.to(data.roomId).emit("u-disconnect", room.username);
        }
        return;
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
      socket.removeAllListeners(chatEnum.sendMessage);
      //   socket.on(
      //     chatEnum.sendMessage,
      //     (
      //       message: string,
      //       roomId: string,
      //       userEmail: string,
      //       username: string
      //     ) => {

      //       this.handleSendMessage(socket, {
      //         roomId,
      //         message,
      //         userEmail,
      //         username,
      //       });
      //     }
      //   );

      socket.on("disconnect", () => {
        console.log('socket disconected',room.roomId);
        if (room && room.roomId) {
          socket.to(room.roomId).emit("u-disconnect", room.username);
        }
      });
    } catch (error: any) {
      console.error("Error in handleJoinRoom:", error);
      socket.emit(chatEnum.error, error.message || "Failed to join room");
    }
  }

  private handleVidoconnection(
    socket: Socket,
    room: { roomId: string; username: string; email: string }
  ) {
    socket.on(chatEnum.videoState, (data) => {
      console.log(
        `Video state change from ${room.username}: ${
          data.enabled ? "ON" : "OFF"
        }`
      );
      socket.broadcast.to(room.roomId).emit(chatEnum.videoState, {
        email: room.email,
        username: room.username,
        enabled: data.enabled,
      });
    });

    socket.on(chatEnum.audioState, (data) => {
      console.log(
        `Audio state change from ${room.username}: ${
          data.enabled ? "ON" : "OFF"
        }`
      );
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
        console.log('datacoming',data);
      if (data.to !== socket.id) {
        console.log('emitting signal to ',data.to,'data',data);
        this.io.to(data.to).emit(chatEnum.signal, {
          ...data,
          from: socket.id,
        });
      }
    });
    
  }

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

  //     } catch (error: any) {
  //       console.error("Error in handleSendMessage:", error);
  //       socket.emit(chatEnum.error, error.message || "Failed to send message");
  //     }
  //   }
}
