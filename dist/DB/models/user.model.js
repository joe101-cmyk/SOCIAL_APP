import mongoose, { Schema } from "mongoose";
import { GenderEnum, RoleEnum } from "../../utils/enum/auth.enum.js";
export const Userschema = new Schema({
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
    },
    confirmemailOTP: {
        type: String,
        required: false,
    },
    confirmemail: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});
Userschema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});
export const User = mongoose.model("User", Userschema);
