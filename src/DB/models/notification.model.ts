import { model, Schema, Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;
  title: string;
  body: string;
  image?: string;
  sender?: Types.ObjectId;
  receiver?: Types.ObjectId;
  type?: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    image: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "general" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification_model = model<INotification>("Notification", notificationSchema);
