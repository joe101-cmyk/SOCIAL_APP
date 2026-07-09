import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IFriend {
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
}

export const Friend_Schema = new Schema<IFriend>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export const Friend_model = mongoose.model<IFriend>(
    "Friend",
    Friend_Schema
);

export type HydratedFriendDocument =
    HydratedDocument<IFriend>;