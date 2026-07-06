    import { Iuser } from "../../DB/models/user.model.js"
    import userService from "./user.service.js";

    export class resolver {
    getprofile = async(_:any, args:any,{user}: {user:Iuser})=>{ 
            return await userService.getprofille(user);
        }    }

        export default new resolver();