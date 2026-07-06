    import { Request, Response } from "express"

    class user_service {
    constructor(){}
    getprofille = async(user:any)=>{
        return {
            message:"User_Profille",
            data:user
        }
    }
}

export default new user_service();



