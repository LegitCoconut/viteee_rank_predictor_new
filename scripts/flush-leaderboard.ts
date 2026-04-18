import 'dotenv/config';
import { Redis } from '@upstash/redis';

const LEADERBOARD_KEY = 'mocktest:leaderboard';

async function main() {
    if (!process.argv.includes('--yes')) {
        console.error('Refusing to flush leaderboard. Re-run with --yes to confirm.');
        console.error('Example: npm run flush:leaderboard -- --yes');
        process.exit(1);
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in .env');
        process.exit(1);
    }

    const redis = new Redis({ url, token });

    const sizeBefore = await redis.zcard(LEADERBOARD_KEY);
    console.log(`Connected to ${url}`);
    console.log(`Leaderboard entries before flush: ${sizeBefore}`);

    await redis.del(LEADERBOARD_KEY);

    const sizeAfter = await redis.zcard(LEADERBOARD_KEY);
    console.log(`Leaderboard entries after flush:  ${sizeAfter}`);
    console.log('Done.');
}

main().catch(err => {
    console.error('Flush failed:', err);
    process.exit(1);
});
