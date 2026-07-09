import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { GenderEnum, RoleEnum } from "../../utils/enum/auth.enum.js";
import { generateHash } from "../../utils/security/Hash.js";

export interface Iuser {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    confirmemailOTP?: string;
    confirmemail?: Date;
    phone?: string;
    address?: string;
    gender: GenderEnum;
    role: RoleEnum;
    profileImage?: string;
    coverImage?: string;
    bio?: string;
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
    isDeleted?: boolean;
    deletedAt?: Date;
    fcmTokens?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export const Userschema = new Schema<Iuser>(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50,
        },

        lastname: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50,
        },

        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        confirmemailOTP: { type: String },
        confirmemail: { type: Date },
        password: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        profileImage: { type: String },
        coverImage: { type: String },
        bio: { type: String },
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: Schema.Types.ObjectId, ref: "User" }],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        fcmTokens: [{ type: String }],
        gender: {
            type: String,
            enum: Object.values(GenderEnum),
            default: GenderEnum.MALE,
        },

        role: {
            type: String,
            enum: Object.values(RoleEnum),
            default: RoleEnum.USER,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

Userschema.virtual("fullname").get(function (this: Iuser) {
    return `${this.firstname} ${this.lastname}`;
});

Userschema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await generateHash(this.password);
});

Userschema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate() as any;

    if (update?.password) {
        update.password = await generateHash(update.password);
    }
});

export const User_model = mongoose.model<Iuser>("User", Userschema);

export type HydratedUserDocument = HydratedDocument<Iuser>;