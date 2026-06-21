import jwt from "jsonwebtoken";
import { RoleEnum, signtureEnum, TokenTypeEnum } from "../enum/auth.enum.js";
import { config } from "../../config/config.service.js";
import { randomUUID } from "crypto";
import { Badrequestextiption } from "../response/error.js";
import { redisService } from "../../DB/redis.service.js";
export class TokenService {
    constructor() { }
    sign = async (payload, secret, option) => {
        return jwt.sign(payload, secret, option);
    };
    verify = async (token, secret) => {
        return jwt.verify(token, secret);
    };
    getSignature = (signatureLevel = signtureEnum.USER) => {
        let signature = {
            accessSignature: "",
            refreshSignature: ""
        };
        switch (signatureLevel) {
            case signtureEnum.ADMIN:
                signature.accessSignature =
                    config.Token_Access_admin_secret_key;
                signature.refreshSignature =
                    config.Token_Refresh_admin_secret_key;
                break;
            case signtureEnum.USER:
                signature.accessSignature =
                    config.Token_Access_user_secret_key;
                signature.refreshSignature =
                    config.Token_Refresh_user_secret_key;
                break;
        }
        return signature;
    };
    getNewLoginCredentials = async (user) => {
        const signature = this.getSignature(user.role === RoleEnum.ADMIN
            ? signtureEnum.ADMIN
            : signtureEnum.USER);
        const jwtid = randomUUID();
        const accessToken = await this.sign({
            id: user.id,
            jti: jwtid,
            role: user.role
        }, signature.accessSignature, {
            expiresIn: "1h"
        });
        const refreshToken = await this.sign({
            id: user.id,
            jti: jwtid,
            role: user.role
        }, signature.refreshSignature, {
            expiresIn: "7d"
        });
        await redisService.set(jwtid, {
            userId: user.id
        }, 60 * 60 * 24 * 7);
        return {
            accessToken,
            refreshToken
        };
    };
    decodeToken = async ({ authorization, tokenType }) => {
        if (!authorization) {
            throw new Badrequestextiption("Missing Headers Authorization");
        }
        const [Bearer, token] = authorization.split(" ");
        if (Bearer !== "Bearer" || !token) {
            throw new Badrequestextiption("Invalid Token Format");
        }
        const decodedToken = jwt.decode(token);
        if (!decodedToken?.role) {
            throw new Badrequestextiption("Invalid Token Payload");
        }
        const signature = this.getSignature(decodedToken.role === RoleEnum.ADMIN
            ? signtureEnum.ADMIN
            : signtureEnum.USER);
        const secretKey = tokenType === TokenTypeEnum.Access
            ? signature.accessSignature
            : signature.refreshSignature;
        const decoded = await this.verify(token, secretKey);
        const exists = await redisService.exists(decoded.jti);
        if (!exists) {
            throw new Badrequestextiption("Session Expired");
        }
        return decoded;
    };
}
