import express, { NextFunction } from "express";
import { Request,Response } from "express";
import { Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { authrouter,postrouter,commentrouter,userrouter } from "./modules/index.js";
import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";
import { Badrequestextiption, globalmiddleware } from "./utils/response/error.js";
import "./config/config.service.js";
import { connectDB } from "./DB/connect.js";
import { request } from "node:http";
import { connectRedis } from "./DB/readis.connection.js";
import { User_model, Userschema } from "./DB/models/user.model.js";
const limit= rateLimit({
    windowMs:15*60*1000,
    max:20,
    message:{
        statuscode:429,
        message:"To many request , Try agin later ",
    }
})






export const bootstrap = async()=>{
    
    const app:Express = express();
    app.use(express.json(),cors(),helmet(),limit);
    const PORT = process.env.PORT||5000;
    await connectDB();
    
    await connectRedis();
    
    const user = new User_model({
    "firstname": "Ahmed",
    "lastname": "Mohamed",
    "username": "Ahmed Mohaasmed",
    "email": `${Date.now()}gmail.com`,
    "password": "123456",
    "confirmPassword": "123456"
}).save();
    
    app.get("/",(req:Request,res:Response,next:NextFunction):Response=>{
        return res.status(200).json({message:"Hello Ts"});
        
    })
app.use(globalmiddleware)
    app.use("/api/auth",authrouter);
    app.use("/api/comment",commentrouter);
    app.use("/api/user",userrouter);
    app.use("/api/post",postrouter);    
        app.use("{/*dummy}",(req:Request,res:Response):Response=>{
            // return res.status(404).json({message:"Not Found Handelare"})
            throw new Badrequestextiption("not Found Handelare !!")
        })

    app.listen(PORT,()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        
    })

}