import { redisClient } from "./readis.connection.js";
export class RedisService {
    async set(key, value, ttl) {
        if (ttl) {
            await redisClient.set(key, JSON.stringify(value), {
                EX: ttl
            });
        }
        else {
            await redisClient.set(key, JSON.stringify(value));
        }
    }
    async get(key) {
        const value = await redisClient.get(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }
    async delete(key) {
        await redisClient.del(key);
    }
    async exists(key) {
        return (await redisClient.exists(key)) === 1;
    }
    async expire(key, seconds) {
        await redisClient.expire(key, seconds);
    }
    async increment(key) {
        return await redisClient.incr(key);
    }
    async decrement(key) {
        return await redisClient.decr(key);
    }
}
export const redisService = new RedisService();
