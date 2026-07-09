import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import notificationService from "./notification.service.js";

const router = Router();

router.post(
  "/",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.ADMIN]),
  notificationService.create
);

router.get(
  "/",
  authentication({ tokenType: TokenTypeEnum.Access }),
  notificationService.getAll
);

router.get(
  "/:id",
  authentication({ tokenType: TokenTypeEnum.Access }),
  notificationService.getById
);

router.patch(
  "/:id",
  authentication({ tokenType: TokenTypeEnum.Access }),
  notificationService.update
);

router.delete(
  "/:id",
  authentication({ tokenType: TokenTypeEnum.Access }),
  notificationService.remove
);

export default router;
