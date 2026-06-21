import mongoose, { HydratedDocument, Schema } from "mongoose";
import { GenderEnum, RoleEnum } from "../../utils/enum/auth.enum.js";
import { EventEmitter } from "node:stream";
import { generateHash } from "../../utils/security/Hash.js";

export interface Iuser {
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

        confirmemailOTP: {
            type: String,
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
    },
    {
        timestamps: true,

        toJSON: {
            virtuals: true,
        },

        toObject: {
            virtuals: true,
        },
    }
);


Userschema.virtual("fullname").get(function (this: Iuser) {
    return `${this.firstname} ${this.lastname}`;
});



Userschema.pre("validate", function () {
    console.log("Pre Validate");
});

Userschema.pre("save", async function () {
    console.log("Pre Save");
});

Userschema.post("save", function (doc, next) {
    console.log("Post Save", doc);
    next();
});

Userschema.post("save", async function (){
    if(this.isModified("password")){
        console.log("Password has been modified");
        this.password = await generateHash(this.password);
    }

});

export const User = mongoose.model<Iuser>(
    "User",
    Userschema
);

export type HydratedUserDocument =
    HydratedDocument<Iuser>;