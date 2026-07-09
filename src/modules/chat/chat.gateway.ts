import { Server, Socket } from "socket.io";
import { TokenService } from "../../utils/Token/Token.js";
import ChatService from "./chat.service.js";
import { chatEvents } from "./chat.events.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import { Badrequestextiption, Notfound } from "../../utils/response/error.js";
import { Types } from "mongoose";

type ChatSocket = Socket & {
  data: {
    user: {
      id: string;
      role: string;
    };
  };
};

class ChatGateway {
  private io?: Server;
  private tokenService = new TokenService();
  private userSockets = new Map<string, Set<string>>();

  init(io: Server) {
    this.io = io;
    this.applyAuthentication();
    this.registerConnection();
  }

  private applyAuthentication() {
    if (!this.io) return;

    this.io.use(async (socket: ChatSocket, next) => {
      try {
        const authorization =
          socket.handshake.auth.authorization ||
          socket.handshake.headers.authorization;

        if (!authorization || typeof authorization !== "string") {
          return next(new Error("Authentication failed: missing authorization token"));
        }

        const decoded = await this.tokenService.decodeToken({
          authorization,
          tokenType: TokenTypeEnum.Access
        });

        socket.data = socket.data || {};
        socket.data.user = {
          id: decoded.id,
          role: decoded.role
        };

        next();
      } catch (error: any) {
        next(new Error(`Authentication failed: ${error.message}`));
      }
    });
  }

  private registerConnection() {
    if (!this.io) return;

    this.io.on(chatEvents.CONNECTION, (socket: ChatSocket) => {
      const userId = socket.data?.user?.id;

      if (!userId) {
        socket.disconnect(true);
        return;
      }

      this.trackSocket(userId, socket.id);
      socket.join(`user:${userId}`);
      socket.emit(chatEvents.AUTHENTICATED, { userId });

      socket.on(chatEvents.PRIVATE_MESSAGE, async (payload) => {
        try {
          const { receiverId, content } = payload;
          const chat = await ChatService.sendPrivateMessage(userId, receiverId, content);

          this.emitToUser(receiverId, chatEvents.PRIVATE_MESSAGE, {
            roomId: chat.roomId,
            senderId: userId,
            content,
            createdAt: new Date(),
            lastMessage: chat.lastMessage,
            unreadCount: chat.unreadCount
          });

          this.emitToUser(userId, chatEvents.PRIVATE_MESSAGE, {
            roomId: chat.roomId,
            senderId: userId,
            content,
            createdAt: new Date(),
            lastMessage: chat.lastMessage,
            unreadCount: chat.unreadCount
          });
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.GROUP_MESSAGE, async (payload) => {
        try {
          const { roomId, content } = payload;
          const message = await ChatService.sendGroupMessage(userId, roomId, content);

          this.io?.to(roomId).emit(chatEvents.GROUP_MESSAGE, message);
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.JOIN_ROOM, async (payload) => {
        try {
          const { roomId } = payload;
          const chatRoom = await ChatService.joinRoom(userId, roomId);
          socket.join(roomId);
          socket.emit(chatEvents.JOIN_ROOM, chatRoom);
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.LEAVE_ROOM, async (payload) => {
        try {
          const { roomId } = payload;
          await ChatService.leaveRoom(userId, roomId);
          socket.leave(roomId);
          socket.emit(chatEvents.LEAVE_ROOM, { roomId });
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.CREATE_GROUP, async (payload) => {
        try {
          const { roomId, memberIds, title } = payload;
          const groupChat = await ChatService.createGroupChat(userId, roomId, memberIds, title);
          this.io?.to(`user:${userId}`).emit(chatEvents.CREATE_GROUP, groupChat);
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.TYPING_START, async (payload) => {
        try {
          const { roomId, receiverId } = payload;
          if (roomId) {
            socket.to(roomId).emit(chatEvents.TYPING_START, { roomId, userId });
          } else if (receiverId) {
            this.emitToUser(receiverId, chatEvents.TYPING_START, { senderId: userId });
          }
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on(chatEvents.TYPING_STOP, async (payload) => {
        try {
          const { roomId, receiverId } = payload;
          if (roomId) {
            socket.to(roomId).emit(chatEvents.TYPING_STOP, { roomId, userId });
          } else if (receiverId) {
            this.emitToUser(receiverId, chatEvents.TYPING_STOP, { senderId: userId });
          }
        } catch (error: any) {
          socket.emit(chatEvents.ERROR, { message: error.message });
        }
      });

      socket.on("error", (err: Error) => {
        socket.emit(chatEvents.ERROR, { message: err.message });
      });

      socket.on(chatEvents.DISCONNECT, () => {
        this.removeSocket(userId, socket.id);
      });
    });
  }

  private trackSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId) || new Set<string>();
    sockets.add(socketId);
    this.userSockets.set(userId, sockets);
  }

  private removeSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.userSockets.delete(userId);
    } else {
      this.userSockets.set(userId, sockets);
    }
  }

  private emitToUser(userId: string, event: string, payload: unknown) {
    this.io?.to(`user:${userId}`).emit(event, payload);
  }
}

export default new ChatGateway();
