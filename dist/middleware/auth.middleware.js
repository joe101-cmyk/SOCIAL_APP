import { TokenTypeEnum } from "../utils/enum/auth.enum.js";
import { TokenService } from "../utils/Token/Token.js";
export const authentication = ({ tokenType = TokenTypeEnum.Access }) => {
    return async (req, res, next) => {
        try {
            const tokenService = new TokenService();
            if (!req.headers.authorization) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
            const decodedToken = await tokenService.decodeToken({
                authorization: req.headers.authorization,
                tokenType
            });
            req.user = {
                id: decodedToken.id,
                role: decodedToken.role
            };
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: error.message
            });
        }
    };
};
