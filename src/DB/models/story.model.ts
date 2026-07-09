import { model, Schema, Types } from "mongoose";

export interface IStory {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId;
  mediaUrl: string;
  mediaType: "image" | "video";
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const storySchema = new Schema<IStory>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true }
);

export const Story_model = model<IStory>("Story", storySchema);
