import { NextFunction, Request, Response } from "express";
import { RoleEnum, TokenTypeEnum } from "../utils/enum/auth.enum.js";
import { TokenService } from "../utils/Token/Token.js";

export interface Irequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authentication = ({
    tokenType = TokenTypeEnum.Access
}: {
    tokenType?: TokenTypeEnum;
}) => {
    return async (
        req: Irequest,
        res: Response,
        next: NextFunction
    ) => {
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
        } catch (error: any) {
            return res.status(401).json({
                message: error.message
            });
        }
    };
};

export const authorization = (roles: string[]) => {
    return (
        req: Irequest,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    };
};