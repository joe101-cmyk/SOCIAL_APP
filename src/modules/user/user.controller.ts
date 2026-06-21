import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import userService from "./user.service.js";

const router:Router = Router();
router.get("/profile",authentication({tokenType:TokenTypeEnum.Access}),userService.getProfile);

export default router;