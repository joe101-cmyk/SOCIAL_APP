import { z } from "zod";

export const SendPrivateMessageSchema = {
  body: z.object({
    receiverId: z.string({ required_error: "Receiver id is required" }).min(1),
    content: z.string({ required_error: "Message content is required" }).min(1)
  })
};

export const CreateRoomSchema = {
  body: z.object({
    roomId: z.string({ required_error: "Room id is required" }).min(1),
    memberIds: z.array(z.string().min(1)).nonempty({ message: "At least one member id is required" })
  })
};

export const JoinRoomSchema = {
  body: z.object({
    roomId: z.string({ required_error: "Room id is required" }).min(1)
  })
};

export const LeaveRoomSchema = JoinRoomSchema;

export const CreateGroupChatSchema = {
  body: z.object({
    roomId: z.string({ required_error: "Room id is required" }).min(1),
    memberIds: z.array(z.string().min(1)).nonempty({ message: "At least one member id is required" }),
    title: z.string({ required_error: "Title is required" }).min(1)
  })
};

export const SendGroupMessageSchema = {
  body: z.object({
    roomId: z.string({ required_error: "Room id is required" }).min(1),
    content: z.string({ required_error: "Message content is required" }).min(1)
  })
};
