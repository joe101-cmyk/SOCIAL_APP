import { redisClient } from "./readis.connection.js";

export class RedisService {

    async set(
        key: string,
        value: any,
        ttl?: number
    ): Promise<void> {

        if (ttl) {
            await redisClient.set(
                key,
                JSON.stringify(value),
                {
                    EX: ttl
                }
            );
        } else {
            await redisClient.set(
                key,
                JSON.stringify(value)
            );
        }
    }

    async get<T>(key: string): Promise<T | null> {

        const value = await redisClient.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as T;
    }

    async delete(key: string): Promise<void> {

        await redisClient.del(key);
    }

    async exists(key: string): Promise<boolean> {

        return (await redisClient.exists(key)) === 1;
    }

    async expire(
        key: string,
        seconds: number
    ): Promise<void> {

        await redisClient.expire(
            key,
            seconds
        );
    }

    async increment(key: string): Promise<number> {

        return await redisClient.incr(key);
    }

    async decrement(key: string): Promise<number> {

        return await redisClient.decr(key);
    }
}

export const redisService = new RedisService();