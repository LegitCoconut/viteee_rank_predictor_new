import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import { MongoClient } from 'mongodb';

const MONGODB_DB = process.env.MONGODB_DB!;
const LEADERBOARD_KEY = 'mocktest:leaderboard';
// Headroom: the reader dedupes by name and returns the top 10. Keep enough raw
// entries in Redis that even noisy repeat-submitters can't push unique names
// out of the visible top 10.
const LEADERBOARD_STORE_LIMIT = 50;

// VITEEE-style marking the mock test uses — mirrors mock-test-ui.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

async function pushToLeaderboard(body: any) {
    try {
        const name = String(body.userId ?? '').trim().slice(0, 40);
        const score = Number(body.score);
        const total = Number(body.totalQuestions);
        if (!name || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return;

        // Older payloads don't carry marks/wrong — derive them from the answers
        // array so the leaderboard stays comparable across schema versions.
        const attempted = Array.isArray(body.answers)
            ? body.answers.filter((a: any) => a?.status === 'answered').length
            : 0;
        const wrong = Number.isFinite(Number(body.wrong))
            ? Number(body.wrong)
            : Math.max(attempted - score, 0);
        const marks = Number.isFinite(Number(body.marks))
            ? Number(body.marks)
            : score * MARK_CORRECT + wrong * MARK_WRONG;
        const maxMarks = Number.isFinite(Number(body.maxMarks)) && Number(body.maxMarks) > 0
            ? Number(body.maxMarks)
            : total * MARK_CORRECT;

        const testLabel =
            body.mode === 'predefined' && body.predefinedId
                ? (body.predefinedName || `Mock Test ${body.predefinedId}`)
                : 'Random Test';

        const entry = {
            examId: body.examId,
            name,
            score,
            wrong,
            marks,
            maxMarks,
            total,
            testLabel,
            timestamp: body.timestamp ?? new Date().toISOString(),
        };

        // Rank by marks-percentage so +4/-1 scoring flows through to ranking.
        const percentage = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
        // Sub-second tiebreaker so two equal scores don't overwrite each other.
        const tieBreaker = Date.now() % 1000 / 1e6;
        const newScore = percentage + tieBreaker;

        // Cheap cull: if the set is already at its store limit, only admit
        // scores that beat the current lowest. Unique-name dedup happens in the
        // reader so we don't risk shrinking the set here.
        const size = await redis.zcard(LEADERBOARD_KEY);
        if (size >= LEADERBOARD_STORE_LIMIT) {
            const lowest = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, 0, { withScores: true });
            const lowestScore = Number(lowest?.[1]);
            if (Number.isFinite(lowestScore) && newScore <= lowestScore) {
                return;
            }
        }

        await redis.zadd(LEADERBOARD_KEY, { score: newScore, member: JSON.stringify(entry) });
        await redis.zremrangebyrank(LEADERBOARD_KEY, 0, -LEADERBOARD_STORE_LIMIT - 1);
    } catch (err) {
        console.error('Failed to push leaderboard entry:', err);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const client: MongoClient = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection('test-results');

        const result = await collection.insertOne(body);

        // Fire-and-forget leaderboard write; never block the response.
        pushToLeaderboard(body);

        return NextResponse.json({ message: 'Test result saved successfully', insertedId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Failed to save test result:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
