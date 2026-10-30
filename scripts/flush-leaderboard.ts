import 'dotenv/config';
import { Redis } from '@upstash/redis';

// Current boards (lb:*) plus the pre-2027 single board.
const LEGACY_KEY = 'mocktest:leaderboard';

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

    console.log(`Connected to ${url}`);
    const keys = [LEGACY_KEY];
    let cursor: string | number = 0;
    do {
        const [next, found]: [string | number, string[]] = await redis.scan(cursor, { match: 'lb:*', count: 100 });
        keys.push(...found);
        cursor = next;
    } while (String(cursor) !== '0');

    const deleted = await redis.del(...keys);
    console.log(`Deleted ${deleted} of ${keys.length} leaderboard keys: ${keys.join(', ')}`);
    console.log('Done.');
}

main().catch(err => {
    console.error('Flush failed:', err);
    process.exit(1);
});
