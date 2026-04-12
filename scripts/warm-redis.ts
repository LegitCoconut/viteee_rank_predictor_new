import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { Redis } from '@upstash/redis';

const COLLECTIONS = ['maths', 'physics', 'chemistry', 'apt_eng'];

function cacheKey(collection: string) {
    return `mocktest:questions:${collection}`;
}

async function main() {
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!mongoUri || !mongoDb) {
        console.error('MONGODB_URI and MONGODB_DB must be set in .env');
        process.exit(1);
    }
    if (!redisUrl || !redisToken) {
        console.error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in .env');
        process.exit(1);
    }

    const mongo = new MongoClient(mongoUri);
    const redis = new Redis({ url: redisUrl, token: redisToken });

    try {
        await mongo.connect();
        const db = mongo.db(mongoDb);

        for (const name of COLLECTIONS) {
            const docs = await db
                .collection(name)
                .find({}, { projection: { _id: 1, image_id: 1, correct_option: 1 } })
                .toArray();

            const pool = docs.map(d => ({
                _id: d._id.toString(),
                image_id: d.image_id.toString(),
                correct_option: d.correct_option,
            }));

            await redis.set(cacheKey(name), pool);
            console.log(`Cached ${pool.length} questions for "${name}" (key: ${cacheKey(name)})`);
        }

        console.log('Warmup complete.');
    } finally {
        await mongo.close();
    }
}

main().catch(err => {
    console.error('Warmup failed:', err);
    process.exit(1);
});
