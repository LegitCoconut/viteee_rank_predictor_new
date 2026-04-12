import 'dotenv/config';
import { Redis } from '@upstash/redis';

async function main() {
    if (!process.argv.includes('--yes')) {
        console.error('Refusing to flush. Re-run with --yes to confirm.');
        console.error('Example: npm run flush:redis -- --yes');
        process.exit(1);
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in .env');
        process.exit(1);
    }

    const redis = new Redis({ url, token });

    const sizeBefore = await redis.dbsize();
    console.log(`Connected to ${url}`);
    console.log(`Keys before flush: ${sizeBefore}`);

    await redis.flushdb();

    const sizeAfter = await redis.dbsize();
    console.log(`Keys after flush:  ${sizeAfter}`);
    console.log('Done.');
}

main().catch(err => {
    console.error('Flush failed:', err);
    process.exit(1);
});
