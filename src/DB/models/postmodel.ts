import { model, Schema, Types } from "mongoose";
import { Iuser } from "./user.model.js";
import { isavaliblity } from "../../utils/enum/auth.enum.js";

export interface Ipost {
    _id?: Types.ObjectId;
    folder_id?: string;
    content?: string;
    conttent?: string;
    attachment?: string[];
    attatchment?: string[];
    likes?: Types.ObjectId[] | Iuser[];
    tags?: Types.ObjectId[] | Iuser[];
    tages?: Types.ObjectId[] | Iuser[];
    avalibality: isavaliblity;
    visibility?: isavaliblity;
    created_by: Types.ObjectId | Iuser;
    updated_by?: Types.ObjectId | Iuser;
    isDeleted?: boolean;
    deleted_at?: Date;
    restore_at?: Date;
    updated_at?: Date;
    created_at?: Date;
}

export const postSchema = new Schema<Ipost>(
    {
        folder_id: { type: String, required: false },
        content: { type: String, required: false },
        conttent: { type: String, required: false },
        attachment: { type: [String], required: false },
        attatchment: { type: [String], required: false },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
        tages: [{ type: Schema.Types.ObjectId, ref: "User" }],
        avalibality: {
            type: Number,
            enum: Object.values(isavaliblity).filter((value) => typeof value === "number"),
            required: true,
            default: isavaliblity.public,
        },
        visibility: {
            type: Number,
            enum: Object.values(isavaliblity).filter((value) => typeof value === "number"),
            default: isavaliblity.public,
        },
        created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updated_by: { type: Schema.Types.ObjectId, ref: "User" },
        isDeleted: { type: Boolean, default: false },
        deleted_at: { type: Date },
        restore_at: { type: Date },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export const postModel = model<Ipost>("Post", postSchema);
export const Post_model = postModel;