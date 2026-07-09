import { model, Schema, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isRead?: boolean;
}

export interface IChat {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  receiver?: Types.ObjectId;
  roomId: string;
  memberIds: Types.ObjectId[];
  isGroup: boolean;
  title?: string;
  messages: IMessage[];
  lastMessage?: string;
  unreadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatSchema = new Schema<IChat>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    roomId: { type: String, required: true, unique: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, default: false },
    title: { type: String, trim: true },
    messages: { type: [MessageSchema], default: [] },
    lastMessage: { type: String, trim: true },
    unreadCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ roomId: 1 });
ChatSchema.index({ memberIds: 1 });

export const Chat_model = model<IChat>("Chat", ChatSchema);
