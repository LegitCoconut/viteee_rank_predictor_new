import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import { SECTIONS } from '@/lib/exam-pattern';

const MONGODB_DB = process.env.MONGODB_DB!;
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

type PredefinedQuestion = {
    _id: string;
    image_id: string;
    correct_option: 'a' | 'b' | 'c' | 'd';
    subject: string;
};

// The stored papers are older 125-question sets. Serve a random 100-question cut with the 2027 per-section
// counts (SECTIONS), kept in paper order within each section and ordered by section.
function cutToPattern<T extends { subject: string }>(arr: T[]): T[] {
    return SECTIONS.flatMap(({ key, questions }) => {
        const inSection = arr.filter(q => q.subject === key);
        const keep = new Set<number>();
        const idx = inSection.map((_, i) => i);
        for (let i = 0; i < Math.min(questions, idx.length); i++) {
            const j = i + Math.floor(Math.random() * (idx.length - i));
            [idx[i], idx[j]] = [idx[j], idx[i]];
            keep.add(idx[i]);
        }
        return inSection.filter((_, i) => keep.has(i));
    });
}

async function loadQuestionsFromMongo(id: number): Promise<PredefinedQuestion[]> {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const docs = await db
        .collection('mocktest_questions')
        .find(
            { mocktest_id: id },
            { projection: { _id: 1, image_id: 1, correct_option: 1, subject: 1 } },
        )
        .toArray();

    return docs.map(d => ({
        _id: d._id.toString(),
        image_id: d.image_id,
        correct_option: d.correct_option,
        subject: d.subject,
    }));
}

type ActiveListEntry = { id: number; name: string; active: boolean };

async function isActive(id: number): Promise<boolean> {
    try {
        const cached = await redis.get<ActiveListEntry[] | string>('mocktest:predefined:active');
        if (cached) {
            const list: ActiveListEntry[] = typeof cached === 'string' ? JSON.parse(cached) : cached;
            const slot = list.find(s => s.id === id);
            if (slot) return !!slot.active;
        }
    } catch (err) {
        console.error('Redis active-list read failed, falling back to Mongo:', err);
    }

    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const doc = await db.collection('mocktests').findOne({ _id: id as any }, { projection: { active: 1 } });
    return !!doc?.active;
}

function recordAttempt(id: number) {
    // Fire-and-forget; never block the response.
    (async () => {
        try {
            const client = await connectToDatabase();
            const db = client.db(MONGODB_DB);
            await Promise.all([
                db.collection('mocktests').updateOne({ _id: id as any }, { $inc: { attempts: 1 } }),
                db
                    .collection('stats')
                    .updateOne({ _id: 'predefined' as any }, { $inc: { total_attempts: 1 } }, { upsert: true }),
            ]);
        } catch (err) {
            console.error('Failed to record predefined mock test attempt:', err);
        }
    })();
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!R2_PUBLIC_URL) {
        return NextResponse.json(
            { message: 'Server misconfigured: image host not set' },
            { status: 500 },
        );
    }

    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1 || id > 5) {
        return NextResponse.json({ message: 'Invalid mock test id' }, { status: 400 });
    }

    try {
        if (!(await isActive(id))) {
            return NextResponse.json({ message: 'Mock test is not active' }, { status: 404 });
        }

        const cacheKey = `mocktest:predefined:${id}:questions`;
        let pool: PredefinedQuestion[] | null = null;

        try {
            const cached = await redis.get<PredefinedQuestion[] | string>(cacheKey);
            if (cached) {
                pool = typeof cached === 'string' ? JSON.parse(cached) : cached;
            }
        } catch (err) {
            console.error(`Redis read failed for predefined ${id}:`, err);
        }

        if (!pool) {
            pool = await loadQuestionsFromMongo(id);
            try {
                await redis.set(cacheKey, pool);
            } catch (err) {
                console.error(`Redis write failed for predefined ${id}:`, err);
            }
        }

        const ordered = cutToPattern(pool);
        const response = ordered.map(q => ({
            _id: q._id,
            image_id: q.image_id,
            correct_option: q.correct_option,
            subject: q.subject,
            imageUrl: `${R2_PUBLIC_URL}/${q.image_id}`,
        }));

        recordAttempt(id);

        return NextResponse.json(response);
    } catch (error) {
        console.error(`Failed to fetch predefined mock test ${id}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
