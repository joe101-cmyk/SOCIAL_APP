
import express, { NextFunction } from "express";
import { Request,Response } from "express";
import { Express } from "express";

import helmet from "helmet";
import cors from "cors";
import  { Server, Socket } from "socket.io";
import { authrouter, postrouter, commentrouter, userrouter, notificationrouter, reactionrouter, storyrouter, dashboardrouter } from "./modules/index.js";
import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";
import { Badrequestextiption, globalmiddleware } from "./utils/response/error.js";
import "./config/config.service.js";
import { connectDB } from "./DB/connect.js";
import { request } from "node:http";
import { connectRedis } from "./DB/readis.connection.js";
import { User_model, Userschema } from "./DB/models/user.model.js";
import { createHandler } from 'graphql-http/lib/use/express';
import { authentication, authorization } from "./middleware/auth.middleware.js";
import { TokenTypeEnum } from "./utils/enum/auth.enum.js";
import { SchemaMetaFieldDef } from "graphql";
import { Schema } from "mongoose";
import { querys } from "./graphql/schema.js";
import { decode } from "jsonwebtoken";
import { TokenService } from "./utils/Token/Token.js";
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
        const token_service = new TokenService();

// app.all("/graphql",authentication({tokenType:TokenTypeEnum.Access}),createHandler({schema:querys}))

    app.all("/graphql",createHandler({schema:querys}));







//     const user = new User_model({
//     "firstname": "Ahmed"
//     "lastname": "Mohamed",
//     "username": "Ahmed Mohamed",
//     "email": `${Date.now()}gmail.com`,
//     "password": "123456",
//     "confirmPassword": "123456"
// }).save();
    
    app.get("/",(req:Request,res:Response,next:NextFunction):Response=>{
        return res.status(200).json({message:"Hello Ts"});
    })

    app.get("/health",(req:Request,res:Response):Response=>{
        return res.status(200).json({status:"ok", service:"social-backend"});
    })

    app.use(globalmiddleware)
    app.use("/api/auth",authrouter);
    app.use("/api/comment",commentrouter);
    app.use("/api/user",userrouter);
    app.use("/api/post",postrouter);
    app.use("/api/notification",notificationrouter);
    app.use("/api/reaction",reactionrouter);
    app.use("/api/story",storyrouter);
    app.use("/api/dashboard",dashboardrouter);
        app.use("{/*dummy}",(req:Request,res:Response):Response=>{
            // return res.status(404).json({message:"Not Found Handelare"})
            throw new Badrequestextiption("not Found Handler !!")
        })

    const http_server = app.listen(PORT,()=>{
            console.log(`Server running on http://localhost:${PORT}`);
    })

    const shutdown = () => {
        console.log("Shutting down server...");
        http_server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);


    const connect_socket = new  Map<string,string>();

        const io = new Server(http_server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket: Socket) => {

    console.log("Client Connected:", socket.id);

    socket.emit("product", {
        id: 1,
        name: "Laptop"
    });

    socket.on("sayHI", (callback) => {
        console.log("HI from Client");

        callback("Hello from Server");
    });

    io.use(async(socket:Socket,next)=>{
        try {
            await token_service.decodeToken({
                authorization:socket.handshake.auth.authorization as string,
                tokenType:TokenTypeEnum.Access,
            })
            
        } catch (error) {
                next(new Error("Authentication failed"));
        }
    })

    socket.on("disconnect", () => {
        console.log("Client Disconnected:", socket.id);
    });

})};


export default bootstrap;