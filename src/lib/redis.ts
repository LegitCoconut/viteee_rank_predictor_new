import Redis from 'ioredis';

const REDIS_URL = process.env.VIT_RANKS_REDIS_CACHE_REDIS_URL;

if (!REDIS_URL) {
    console.warn(
        "Redis configuration missing. Please set VIT_RANKS_REDIS_CACHE_REDIS_URL."
    );
}

// Create a Redis client instance
// If REDIS_URL is not provided, ioredis will try to connect to localhost:6379 by default,
// which is fine for local dev if you have redis running.
export const redis = new Redis(REDIS_URL || 'redis://localhost:6379');
