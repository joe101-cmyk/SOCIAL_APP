import z from "zod";
import { id } from "zod/v4/locales";
export const createpost = {
    body:z.strictObject({
        contenet:z.string().optional(),
        files:z.array(z.string()).optional(),
        tags:z.array(z.string()).optional(),
        isavaliblity:z.coerce.number().default(1).optional(),
    }).superRefine((args, ctx) => {
        if (!args.contenet && !args.files) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Either 'contenet' or 'files' must be provided.",
            });
        }
        if (!args.tags || args.tags.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "At least one tag must be provided.",
            });
        }
    }
    )}