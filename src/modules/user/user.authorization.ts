import { Logout, RoleEnum } from "../../utils/enum/auth.enum.js";


    
export const endpoint = {
    profile:[RoleEnum.USER,RoleEnum.ADMIN],
    Logout:[RoleEnum.USER,RoleEnum.ADMIN],
    refreshToken:[RoleEnum.USER,RoleEnum.ADMIN],
    friend_REQUEST:[RoleEnum.USER,RoleEnum.ADMIN],
    accept_FRIEND_REQ:[RoleEnum.USER,RoleEnum.ADMIN],
}