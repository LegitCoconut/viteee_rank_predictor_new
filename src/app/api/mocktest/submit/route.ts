import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import { MongoClient } from 'mongodb';

const MONGODB_DB = process.env.MONGODB_DB!;
const LEADERBOARD_KEY = 'mocktest:leaderboard';
const LEADERBOARD_MAX_ENTRIES = 10;

async function pushToLeaderboard(body: any) {
    try {
        const name = String(body.userId ?? '').trim().slice(0, 40);
        const score = Number(body.score);
        const total = Number(body.totalQuestions);
        if (!name || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return;

        const testLabel =
            body.mode === 'predefined' && body.predefinedId
                ? (body.predefinedName || `Mock Test ${body.predefinedId}`)
                : 'Random Test';

        const entry = {
            examId: body.examId,
            name,
            score,
            total,
            testLabel,
            timestamp: body.timestamp ?? new Date().toISOString(),
        };

        const percentage = (score / total) * 100;
        // Sub-second tiebreaker so two equal scores don't overwrite each other.
        const tieBreaker = Date.now() % 1000 / 1e6;
        const newScore = percentage + tieBreaker;

        // Only write if this score can make it into the top 10.
        // If the board already has 10 entries, compare against the current lowest.
        const size = await redis.zcard(LEADERBOARD_KEY);
        if (size >= LEADERBOARD_MAX_ENTRIES) {
            const lowest = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, 0, { withScores: true });
            // @upstash/redis returns [member, score, member, score, ...] when withScores=true
            const lowestScore = Number(lowest?.[1]);
            if (Number.isFinite(lowestScore) && newScore <= lowestScore) {
                return;
            }
        }

        await redis.zadd(LEADERBOARD_KEY, { score: newScore, member: JSON.stringify(entry) });
        // Trim back to the top 10 — evicts the lowest that just got bumped out.
        await redis.zremrangebyrank(LEADERBOARD_KEY, 0, -LEADERBOARD_MAX_ENTRIES - 1);
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
