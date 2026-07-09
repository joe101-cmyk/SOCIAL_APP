import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import reactionService from "./reaction.service.js";

const router = Router();

router.post("/", authentication({ tokenType: TokenTypeEnum.Access }), reactionService.setReaction);
router.get("/:postId", authentication({ tokenType: TokenTypeEnum.Access }), reactionService.getCounts);

export default router;
