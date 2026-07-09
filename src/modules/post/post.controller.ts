import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import postService from "./post.service.js";

const router: Router = Router();

router.post(
    "/",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization([RoleEnum.USER, RoleEnum.ADMIN]),
    postService.createPost
);

router.get(
    "/",
    authentication({ tokenType: TokenTypeEnum.Access }),
    postService.getPosts
);

router.get(
    "/:id",
    authentication({ tokenType: TokenTypeEnum.Access }),
    postService.getPostById
);

router.patch(
    "/:id",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization([RoleEnum.USER, RoleEnum.ADMIN]),
    postService.updatePost
);

router.delete(
    "/:id",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization([RoleEnum.USER, RoleEnum.ADMIN]),
    postService.deletePost
);

export default router;