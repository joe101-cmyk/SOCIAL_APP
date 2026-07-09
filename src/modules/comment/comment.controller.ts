import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import commentService from "./comment.service.js";

const router: Router = Router();

router.post(
  "/",
  authentication({ tokenType: TokenTypeEnum.Access }),
  commentService.createComment
);

router.get(
  "/:postId",
  authentication({ tokenType: TokenTypeEnum.Access }),
  commentService.getCommentsByPost
);

router.patch(
  "/:id",
  authentication({ tokenType: TokenTypeEnum.Access }),
  commentService.updateComment
);

router.delete(
  "/:id",
  authentication({ tokenType: TokenTypeEnum.Access }),
  commentService.deleteComment
);

export default router;