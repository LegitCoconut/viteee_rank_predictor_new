import { Redis } from '@upstash/redis';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.warn(
        "Redis configuration missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
    );
}

// Create a Redis client instance
export const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL || 'https://example.upstash.io',
    token: UPSTASH_REDIS_REST_TOKEN || 'example_token',
});
