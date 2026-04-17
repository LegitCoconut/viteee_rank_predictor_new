import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const LEADERBOARD_KEY = 'mocktest:leaderboard';
const FETCH_LIMIT = 30; // headroom so historical duplicates don't eat into the top-10 display
const DISPLAY_LIMIT = 10;

export async function GET() {
    try {
        const members = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, FETCH_LIMIT - 1, { rev: true });

        const seen = new Set<string>();
        const entries: any[] = [];
        for (const m of members ?? []) {
            try {
                const parsed = typeof m === 'string' ? JSON.parse(m) : m;
                const name = parsed?.name ? String(parsed.name).trim().toLowerCase() : '';
                if (!name || seen.has(name)) continue;
                seen.add(name);
                entries.push(parsed);
                if (entries.length >= DISPLAY_LIMIT) break;
            } catch {
                // skip unparseable members
            }
        }

        return NextResponse.json(entries);
    } catch (error) {
        console.error('Failed to read leaderboard:', error);
        return NextResponse.json([], { status: 200 });
    }
}
