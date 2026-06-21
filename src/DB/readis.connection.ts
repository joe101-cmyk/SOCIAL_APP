import redis from "redis";
import { config } from "../config/config.service.js";

export const redisClient = redis.createClient({
    url: config.Redis_URL,
    socket: {
        reconnectStrategy: (retries) => {
            return Math.min(retries * 100, 3000);
        },
    },
});

redisClient.on("connect", () => {
    console.log("Redis connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis ready");
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

redisClient.on("end", () => {
    console.log("Redis disconnected");
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error: any) {
        console.error("Error connecting to Redis:", error.message);
    }
};