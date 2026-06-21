import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { z } from "zod";

type RequestSchema = Partial<{
body: ZodTypeAny;
query: ZodTypeAny;
params: ZodTypeAny;
headers: ZodTypeAny;
}>;

export const validateRequest = (schema: RequestSchema) => {
return (req: Request, res: Response, next: NextFunction) => {
const errors: any[] = [];


for (const key of Object.keys(schema) as (keyof RequestSchema)[]) {
  const zodSchema = schema[key];
  if (!zodSchema) continue;

  const result = zodSchema.safeParse(req[key]);

  if (!result.success) {
    errors.push({
      field: key,
      errors: result.error.issues,
    });
  } else {
    (req as any)[key] = result.data;
  }
}

if (errors.length > 0) {
  return res.status(400).json({
    message: "Validation Error",
    errors,
  });
}

next();


};
};

export const generalfiled = {
username:z.string({error:"Username requried"})
.min(3,{error:"Name at least 3"})
.max(20,{error:"name Max 20 "}),

confirmPassword:z.string({error:"Confirm Password requried"})
.min(6,{error:"Confirm Password at least 6"})
.max(20,{error:"Confirm Password Max 20 "}),

email:z.string({error:"Email requried"}),

password:z.string({error:"Password requried"})
.min(6,{error:"Password at least 6"})
.max(20,{error:"Password Max 20 "}),

firstname:z.string({error:"First Name requried"})
.min(3,{error:"First Name at least 3"})
.max(20,{error:"First Name Max 20 "}),

lastname:z.string({error:"Last Name requried"})
.min(3,{error:"Last Name at least 3"})
.max(20,{error:"Last Name Max 20 "}),
};
