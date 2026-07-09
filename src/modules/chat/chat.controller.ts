import { Request, Response } from "express";
import chatService from "./chat.service.js";

class ChatController {
  getChats = async (req: Request, res: Response): Promise<Response> => {
    const chats = await chatService.getChats(req.user!.id);
    return res.status(200).json({ message: "Chats fetched successfully", data: chats });
  };

  sendPrivateMessage = async (req: Request, res: Response): Promise<Response> => {
    const { receiverId, content } = req.body as { receiverId: string; content: string };
    const chat = await chatService.sendPrivateMessage(req.user!.id, receiverId, content);
    return res.status(201).json({ message: "Message sent successfully", data: chat });
  };

  createRoom = async (req: Request, res: Response): Promise<Response> => {
    const { roomId, memberIds } = req.body as { roomId: string; memberIds: string[] };
    const room = await chatService.createRoom(req.user!.id, roomId, memberIds);
    return res.status(201).json({ message: "Room created successfully", data: room });
  };

  joinRoom = async (req: Request, res: Response): Promise<Response> => {
    const { roomId } = req.body as { roomId: string };
    const room = await chatService.joinRoom(req.user!.id, roomId);
    return res.status(200).json({ message: "Joined room successfully", data: room });
  };

  leaveRoom = async (req: Request, res: Response): Promise<Response> => {
    const { roomId } = req.body as { roomId: string };
    const room = await chatService.leaveRoom(req.user!.id, roomId);
    return res.status(200).json({ message: "Left room successfully", data: room });
  };

  createGroupChat = async (req: Request, res: Response): Promise<Response> => {
    const { roomId, memberIds, title } = req.body as { roomId: string; memberIds: string[]; title: string };
    const room = await chatService.createGroupChat(req.user!.id, roomId, memberIds, title);
    return res.status(201).json({ message: "Group created successfully", data: room });
  };

  getGroupMessages = async (req: Request, res: Response): Promise<Response> => {
    const roomId = req.params.roomId;
    const messages = await chatService.getGroupMessages(req.user!.id, roomId);
    return res.status(200).json({ message: "Room messages fetched", data: messages });
  };

  sendGroupMessage = async (req: Request, res: Response): Promise<Response> => {
    const { roomId, content } = req.body as { roomId: string; content: string };
    const message = await chatService.sendGroupMessage(req.user!.id, roomId, content);
    return res.status(201).json({ message: "Message sent successfully", data: message });
  };
}

export default new ChatController();
