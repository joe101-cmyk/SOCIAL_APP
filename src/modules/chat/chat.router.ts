import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import chatController from "./chat.controller.js";
import {
  CreateGroupChatSchema,
  CreateRoomSchema,
  JoinRoomSchema,
  LeaveRoomSchema,
  SendPrivateMessageSchema,
  SendGroupMessageSchema
} from "./chat.validation.js";

const router: Router = Router();

router.get(
  "/",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  chatController.getChats
);

router.post(
  "/private",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(SendPrivateMessageSchema),
  chatController.sendPrivateMessage
);

router.post(
  "/room",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(CreateRoomSchema),
  chatController.createRoom
);

router.post(
  "/room/join",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(JoinRoomSchema),
  chatController.joinRoom
);

router.post(
  "/room/leave",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(LeaveRoomSchema),
  chatController.leaveRoom
);

router.post(
  "/group",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(CreateGroupChatSchema),
  chatController.createGroupChat
);

router.post(
  "/group/message",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  validateRequest(SendGroupMessageSchema),
  chatController.sendGroupMessage
);

router.get(
  "/room/:roomId/messages",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  chatController.getGroupMessages
);

export default router;
