import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import userService from "./user.service.js";
import { endpoint } from "./user.authorization.js";
    import { authorization } from "../../middleware/auth.middleware.js";
    const router = Router();
    router.get(
    "/profile",
    authentication({
        tokenType: TokenTypeEnum.Access,
    }),
    authorization(endpoint.profile),
    userService.getProfile
);

router.post(
    "/logout",
    authentication({
        tokenType: TokenTypeEnum.Access,
    }),
    authorization(endpoint.Logout),
    userService.logout
);

router.post(
    "/refresh-token",
    authentication({
        tokenType: TokenTypeEnum.Refresh,
    }),
    authorization(endpoint.refreshToken),
    userService.refreshToken
);
router.post(
    "/send-friend-req",
    authentication({
        tokenType: TokenTypeEnum.Access,
    }),
    authorization(endpoint.friend_REQUEST),
    userService.send_FRIEND_REQ
);

router.patch(
    "/accept-friend-req",
    authentication({
        tokenType: TokenTypeEnum.Access,
    }),
    authorization(endpoint.accept_FRIEND_REQ),
    userService.accept_FRIEND_REQ
);
