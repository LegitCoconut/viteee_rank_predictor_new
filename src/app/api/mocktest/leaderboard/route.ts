import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const LEADERBOARD_KEY = 'mocktest:leaderboard';

export async function GET() {
    try {
        // Top 10 by score (descending).
        const members = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, 9, { rev: true });
        const entries = (members ?? [])
            .map(m => {
                try {
                    const parsed = typeof m === 'string' ? JSON.parse(m) : m;
                    return parsed;
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        return NextResponse.json(entries);
    } catch (error) {
        console.error('Failed to read leaderboard:', error);
        return NextResponse.json([], { status: 200 });
    }
}
