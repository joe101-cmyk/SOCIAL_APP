import { z } from "zod";
import { generalfiled } from "../../middleware/validation.middleware.js";
import { Logout } from "../../utils/enum/auth.enum.js";
export const loginschema = {
    body: z.object({
        email: generalfiled.email,
        password: generalfiled.password
    })
        .strict()
};
export const Logout_schema = {
    body: z.strictObject({
        flag: z.enum(Logout)
    })
};
export const Signupschema = {
    body: loginschema.body.extend({
        username: generalfiled.username,
        confirmPassword: generalfiled.confirmPassword,
        firstname: generalfiled.firstname,
        lastname: generalfiled.lastname,
    })
        .strict()
        .superRefine((data, ctx) => {
        if (data.password != data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "Password not match confirm password"
            });
        }
        if (data.username?.split(" ").length < 2) {
            ctx.addIssue({
                code: "custom",
                path: ["username"],
                message: "Full Name at least 2 words "
            });
        }
    })
};
