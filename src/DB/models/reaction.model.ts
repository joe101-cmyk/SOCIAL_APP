import { model, Schema, Types } from "mongoose";

export type ReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

export interface IReaction {
  _id?: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  type: ReactionType;
  createdAt?: Date;
  updatedAt?: Date;
}

const reactionSchema = new Schema<IReaction>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"], required: true },
  },
  { timestamps: true }
);

reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Reaction_model = model<IReaction>("Reaction", reactionSchema);
