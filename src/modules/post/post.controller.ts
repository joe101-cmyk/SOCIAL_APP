import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enum/auth.enum.js";

const router:Router = Router();
router.post(
    "/",
    authentication({
        tokenType: TokenTypeEnum.Access
    }),
    authorization([RoleEnum.ADMIN]),
);


export default router;