import { Router,Request,Response } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../enum/auth.enum.js";
import userService from "./user.service.js";


const router = Router();

router.get("/profile",authentication({tokenType:TokenTypeEnum.Access}),async(req:Request,res:Response)=>{
    const user = req.user;
    const data = await userService.getprofille(user);
        return res.status(200).json({message:"Done",data});


})