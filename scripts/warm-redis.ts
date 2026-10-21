import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { Redis } from '@upstash/redis';

const SUBJECT_COLLECTIONS = ['maths', 'physics', 'chemistry', 'apt_eng'];
const ACTIVE_KEY = 'mocktest:predefined:active';

function subjectKey(name: string) {
    return `mocktest:questions:${name}`;
}

function predefinedKey(id: number) {
    return `mocktest:predefined:${id}:questions`;
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

        console.log('- Subject pools -');
        for (const name of SUBJECT_COLLECTIONS) {
            const docs = await db
                .collection(name)
                .find({}, { projection: { _id: 1, image_id: 1, correct_option: 1 } })
                .toArray();

            const pool = docs.map(d => ({
                _id: d._id.toString(),
                image_id: d.image_id.toString(),
                correct_option: d.correct_option,
            }));

            await redis.set(subjectKey(name), pool);
            console.log(`  Cached ${pool.length} questions for "${name}"`);
        }

        console.log('- Predefined mock tests -');

        // Seed the 5 slots + global stats doc if missing. Idempotent: $setOnInsert
        // means an already-active test is left alone.
        const now = new Date();
        for (let id = 1; id <= 5; id++) {
            await db.collection('mocktests').updateOne(
                { _id: id as any },
                {
                    $setOnInsert: {
                        _id: id,
                        name: `Mock Test ${id}`,
                        active: false,
                        attempts: 0,
                        updated_at: now,
                    },
                },
                { upsert: true },
            );
        }
        await db.collection('stats').updateOne(
            { _id: 'predefined' as any },
            { $setOnInsert: { _id: 'predefined', total_attempts: 0 } },
            { upsert: true },
        );

        const mocktests = await db
            .collection('mocktests')
            .find({}, { projection: { _id: 1, name: 1, active: 1 } })
            .sort({ _id: 1 })
            .toArray();

        const summaries = mocktests.map(d => ({
            id: d._id as unknown as number,
            name: d.name,
            active: !!d.active,
        }));
        await redis.set(ACTIVE_KEY, summaries);
        console.log(`  Cached predefined list (${summaries.length} slots, ${summaries.filter(s => s.active).length} active)`);

        for (const summary of summaries) {
            if (!summary.active) {
                // Clear any stale cache from a previous activation.
                await redis.del(predefinedKey(summary.id));
                console.log(`  Skipped inactive "${summary.name}" (id ${summary.id}); cleared stale key if any`);
                continue;
            }
            const docs = await db
                .collection('mocktest_questions')
                .find(
                    { mocktest_id: summary.id },
                    { projection: { _id: 1, image_id: 1, correct_option: 1, subject: 1 } },
                )
                .toArray();

            const pool = docs.map(d => ({
                _id: d._id.toString(),
                image_id: d.image_id,
                correct_option: d.correct_option,
                subject: d.subject,
            }));

            await redis.set(predefinedKey(summary.id), pool);
            console.log(`  Cached ${pool.length} questions for "${summary.name}" (id ${summary.id})`);
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
