import { createClient } from '@vercel/kv';

const KV_REST_API_URL = process.env.VIT_RANKS_REDIS_CACHE_REDIS_URL || process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.VIT_RANKS_REDIS_CACHE_REDIS_TOKEN || process.env.KV_REST_API_TOKEN;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    console.warn(
        "Redis configuration missing. Please set VIT_RANKS_REDIS_CACHE_REDIS_URL and VIT_RANKS_REDIS_CACHE_REDIS_TOKEN."
    );
}

export const redis = createClient({
    url: KV_REST_API_URL || '',
    token: KV_REST_API_TOKEN || '',
});
