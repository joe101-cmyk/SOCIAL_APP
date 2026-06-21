import { Logout_schema, Signupschema } from "./auth.validation.js";
import { z } from "zod";

export type SignupDTO = z.infer<typeof Signupschema.body>;
export type LoginDTO = z.infer<typeof Signupschema.body>;
export type Ilogout = z.infer<typeof Logout_schema.body>;