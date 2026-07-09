import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../utils/enum/auth.enum.js";
import userService from "./user.service.js";
import { endpoint } from "./user.authorization.js";

const router = Router();

router.get(
    "/profile",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization(endpoint.profile),
    userService.getProfile
);

router.get(
    "/profile/:userId",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.getPublicProfile
);

router.get(
    "/",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.getUsers
);

router.patch(
    "/",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.updateProfile
);

router.delete(
    "/",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.deleteUser
);

router.post(
    "/logout",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization(endpoint.Logout),
    userService.logout
);

router.post(
    "/refresh-token",
    authentication({ tokenType: TokenTypeEnum.Refresh }),
    authorization(endpoint.refreshToken),
    userService.refreshToken
);

router.post(
    "/send-friend-req",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization(endpoint.friend_REQUEST),
    userService.send_FRIEND_REQ
);

router.patch(
    "/accept-friend-req",
    authentication({ tokenType: TokenTypeEnum.Access }),
    authorization(endpoint.accept_FRIEND_REQ),
    userService.accept_FRIEND_REQ
);

router.post(
    "/follow",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.followUser
);

router.post(
    "/fcm-token",
    authentication({ tokenType: TokenTypeEnum.Access }),
    userService.storeFcmToken
);

export default router;
