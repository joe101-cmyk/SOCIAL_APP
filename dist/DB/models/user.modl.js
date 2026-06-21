import mongoose, { Schema } from "mongoose";
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
    email: {
        type: String,
        required: true,
    },
    confirmemailOTP: {
        type: String,
        required: true,
    },
    confirmemail: {
        type: Date,
    },
    pawsword: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    Address: {
        type: String,
    },
    confirmPassword: {
        type: String,
        required: true,
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
