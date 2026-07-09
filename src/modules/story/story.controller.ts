import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import storyService from "./story.service.js";

const router = Router();

router.post("/", authentication({ tokenType: TokenTypeEnum.Access }), storyService.create);
router.get("/", authentication({ tokenType: TokenTypeEnum.Access }), storyService.getAll);
router.get("/friends", authentication({ tokenType: TokenTypeEnum.Access }), storyService.getFriendsStories);
router.delete("/:id", authentication({ tokenType: TokenTypeEnum.Access }), storyService.remove);

export default router;
