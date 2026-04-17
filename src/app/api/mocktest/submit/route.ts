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
        const normalizedName = name.toLowerCase();

        // Look for existing entries from the same student (case-insensitive name match).
        // Members are stored as raw JSON strings.
        const allMembers = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, -1, { withScores: true });
        let bestExistingScore = -Infinity;
        const sameNameMembers: string[] = [];
        // Format: [member, score, member, score, ...]
        for (let i = 0; i < allMembers.length; i += 2) {
            const memberStr = allMembers[i];
            const existingScore = Number(allMembers[i + 1]);
            try {
                const parsed = typeof memberStr === 'string' ? JSON.parse(memberStr) : memberStr;
                if (parsed?.name && String(parsed.name).toLowerCase() === normalizedName) {
                    sameNameMembers.push(memberStr);
                    if (Number.isFinite(existingScore) && existingScore > bestExistingScore) {
                        bestExistingScore = existingScore;
                    }
                }
            } catch {
                // skip unparseable members
            }
        }

        if (sameNameMembers.length > 0) {
            // This student is already on the board. Replace only if the new score is strictly better.
            if (newScore <= bestExistingScore) return;
            await redis.zrem(LEADERBOARD_KEY, ...sameNameMembers);
        }

        // Only write if this score can make it into the top 10.
        const size = await redis.zcard(LEADERBOARD_KEY);
        if (size >= LEADERBOARD_MAX_ENTRIES) {
            const lowest = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, 0, { withScores: true });
            const lowestScore = Number(lowest?.[1]);
            if (Number.isFinite(lowestScore) && newScore <= lowestScore) {
                return;
            }
        }

        await redis.zadd(LEADERBOARD_KEY, { score: newScore, member: JSON.stringify(entry) });
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
