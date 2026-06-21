
import mongoose, { connection } from "mongoose";
import { config } from "../config/config.service.js";
export const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(config.DB_URI as string,{
            serverSelectionTimeoutMS:5000,
        });
        console.log(`MongoDB Connect ${connect.connection.host}`);
        
    } catch (error) {
        console.log(`Error:${(error as Error).message}`);
        
    }
}