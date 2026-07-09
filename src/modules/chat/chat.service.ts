import { Types } from "mongoose";
import { Chat_model, IChat } from "../../DB/models/chat.model.js";
import { User_model } from "../../DB/models/user.model.js";
import { Badrequestextiption, Notfound } from "../../utils/response/error.js";

class ChatService {
  private buildPrivateRoomId(userIds: string[]): string {
    return userIds.sort().join(":");
  }

  async getChats(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const chats = await Chat_model.find({
      memberIds: userObjectId
    })
      .sort({ updatedAt: -1 })
      .populate("sender", "username firstname lastname profileImage")
      .populate("receiver", "username firstname lastname profileImage")
      .populate("memberIds", "username firstname lastname profileImage")
      .lean();

    return chats.map((chat) => ({
      ...chat,
      lastMessage: chat.lastMessage || "",
      unreadCount: chat.unreadCount || 0
    }));
  }

  async sendPrivateMessage(senderId: string, receiverId: string, content: string) {
    if (!Types.ObjectId.isValid(receiverId)) {
      throw new Badrequestextiption("Invalid receiver id");
    }

    if (senderId === receiverId) {
      throw new Badrequestextiption("Cannot send message to yourself");
    }

    const receiver = await User_model.findById(receiverId).select("_id");
    if (!receiver) {
      throw new Notfound("Receiver not found");
    }

    const roomId = this.buildPrivateRoomId([senderId, receiverId]);
    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    const chat = await Chat_model.findOneAndUpdate(
      { roomId },
      {
        $set: {
          sender: senderObjectId,
          receiver: receiverObjectId,
          roomId,
          isGroup: false,
          memberIds: [senderObjectId, receiverObjectId]
        },
        $push: {
          messages: {
            sender: senderObjectId,
            content,
            isRead: false
          }
        },
        $inc: { unreadCount: 1 },
        $set: { lastMessage: content }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    if (!chat) {
      throw new Error("Unable to save message");
    }

    return chat;
  }

  async createRoom(userId: string, roomId: string, memberIds: string[]) {
    if (!roomId || !Array.isArray(memberIds) || memberIds.length === 0) {
      throw new Badrequestextiption("Room id and members are required");
    }

    const members = [userId, ...memberIds];
    const distinctMembers = Array.from(new Set(members));

    if (!distinctMembers.every(Types.ObjectId.isValid)) {
      throw new Badrequestextiption("Invalid member ids");
    }

    const memberObjectIds = distinctMembers.map((id) => new Types.ObjectId(id));

    const existingRoom = await Chat_model.findOne({ roomId });
    if (existingRoom) {
      throw new Badrequestextiption("Room already exists");
    }

    const chat = await Chat_model.create({
      sender: new Types.ObjectId(userId),
      roomId,
      memberIds: memberObjectIds,
      isGroup: false,
      messages: [],
      unreadCount: 0
    } as IChat);

    return chat;
  }

  async joinRoom(userId: string, roomId: string) {
    if (!roomId) {
      throw new Badrequestextiption("Room id is required");
    }

    const chat = await Chat_model.findOne({ roomId });
    if (!chat) {
      throw new Notfound("Room not found");
    }

    const memberObjectId = new Types.ObjectId(userId);
    if (!chat.memberIds.some((id) => id.equals(memberObjectId))) {
      chat.memberIds.push(memberObjectId);
      await chat.save();
    }

    return chat;
  }

  async leaveRoom(userId: string, roomId: string) {
    if (!roomId) {
      throw new Badrequestextiption("Room id is required");
    }

    const chat = await Chat_model.findOne({ roomId });
    if (!chat) {
      throw new Notfound("Room not found");
    }

    const memberObjectId = new Types.ObjectId(userId);
    chat.memberIds = chat.memberIds.filter((id) => !id.equals(memberObjectId));
    await chat.save();

    return chat;
  }

  async createGroupChat(userId: string, roomId: string, memberIds: string[], title: string) {
    if (!roomId || !title || !Array.isArray(memberIds) || memberIds.length === 0) {
      throw new Badrequestextiption("Room id, title and members are required");
    }

    const members = [userId, ...memberIds];
    const distinctMembers = Array.from(new Set(members));

    if (!distinctMembers.every(Types.ObjectId.isValid)) {
      throw new Badrequestextiption("Invalid member ids");
    }

    const memberObjectIds = distinctMembers.map((id) => new Types.ObjectId(id));

    const existingRoom = await Chat_model.findOne({ roomId });
    if (existingRoom) {
      throw new Badrequestextiption("Room already exists");
    }

    const chat = await Chat_model.create({
      sender: new Types.ObjectId(userId),
      roomId,
      memberIds: memberObjectIds,
      isGroup: true,
      title,
      messages: [],
      unreadCount: 0
    } as IChat);

    return chat;
  }

  async getGroupMessages(userId: string, roomId: string) {
    if (!roomId) {
      throw new Badrequestextiption("Room id is required");
    }

    const chat = await Chat_model.findOne({ roomId }).lean();
    if (!chat) {
      throw new Notfound("Room not found");
    }

    if (!chat.memberIds.some((id) => id.equals(new Types.ObjectId(userId)))) {
      throw new Badrequestextiption("Unauthorized to view room messages");
    }

    return chat.messages;
  }

  async sendGroupMessage(senderId: string, roomId: string, content: string) {
    if (!roomId || !content?.trim()) {
      throw new Badrequestextiption("Room id and content are required");
    }

    const chat = await Chat_model.findOne({ roomId });
    if (!chat) {
      throw new Notfound("Room not found");
    }

    const senderObjectId = new Types.ObjectId(senderId);
    if (!chat.memberIds.some((id) => id.equals(senderObjectId))) {
      throw new Badrequestextiption("User is not a member of this room");
    }

    chat.messages.push({ sender: senderObjectId, content, isRead: false });
    chat.lastMessage = content;
    chat.unreadCount += 1;
    await chat.save();

    return {
      roomId: chat.roomId,
      senderId,
      content,
      createdAt: chat.messages[chat.messages.length - 1]?.createdAt,
      isGroup: chat.isGroup,
      title: chat.title,
      memberIds: chat.memberIds
    };
  }
}

export default new ChatService();
