import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';

const MONGODB_DB = process.env.MONGODB_DB!;
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

type CachedQuestion = {
    _id: string;
    image_id: string;
    correct_option: 'a' | 'b' | 'c' | 'd';
};

const SUBJECTS: { collection: string; count: number }[] = [
    { collection: 'maths', count: 40 },
    { collection: 'physics', count: 35 },
    { collection: 'chemistry', count: 35 },
    { collection: 'apt_eng', count: 15 },
];

function cacheKey(collection: string) {
    return `mocktest:questions:${collection}`;
}

async function loadPool(collection: string): Promise<CachedQuestion[]> {
    try {
        const cached = await redis.get<CachedQuestion[] | string>(cacheKey(collection));
        if (cached) {
            // @upstash/redis auto-parses JSON when stored as a string; handle both shapes.
            return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
    } catch (err) {
        console.error(`Redis read failed for ${collection}, falling back to Mongo:`, err);
    }

    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const docs = await db
        .collection(collection)
        .find({}, { projection: { _id: 1, image_id: 1, correct_option: 1 } })
        .toArray();

    const pool: CachedQuestion[] = docs.map(d => ({
        _id: d._id.toString(),
        image_id: d.image_id.toString(),
        correct_option: d.correct_option,
    }));

    try {
        await redis.set(cacheKey(collection), pool);
    } catch (err) {
        console.error(`Redis write failed for ${collection}:`, err);
    }

    return pool;
}

function sample<T>(arr: T[], n: number): T[] {
    const copy = arr.slice();
    const limit = Math.min(n, copy.length);
    for (let i = 0; i < limit; i++) {
        const j = i + Math.floor(Math.random() * (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, limit);
}

export async function GET() {
    if (!R2_PUBLIC_URL) {
        console.error('NEXT_PUBLIC_R2_PUBLIC_URL is not set');
        return NextResponse.json(
            { message: 'Server misconfigured: image host not set' },
            { status: 500 },
        );
    }

    try {
        const pools = await Promise.all(SUBJECTS.map(s => loadPool(s.collection)));

        const allQuestions = SUBJECTS.flatMap((subject, idx) =>
            sample(pools[idx], subject.count).map(q => ({
                _id: q._id,
                image_id: q.image_id,
                correct_option: q.correct_option,
                subject: subject.collection,
                imageUrl: `${R2_PUBLIC_URL}/${q.image_id}`,
            })),
        );

        return NextResponse.json(allQuestions);
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
