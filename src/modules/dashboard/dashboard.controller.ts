import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import dashboardService from "./dashboard.service.js";

const router = Router();

router.get(
  "/",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.ADMIN]),
  dashboardService.getSummary
);

export default router;
