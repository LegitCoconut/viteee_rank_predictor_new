import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const LEADERBOARD_KEY = 'mocktest:leaderboard';
// Must match LEADERBOARD_STORE_LIMIT in submit/route.ts — read every member so
// per-name dedup can't leave us short of DISPLAY_LIMIT unique students.
const FETCH_LIMIT = 50;
const DISPLAY_LIMIT = 10;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'random' | 'predefined' | null (all)

    try {
        const members = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, FETCH_LIMIT - 1, { rev: true });

        const seen = new Set<string>();
        const entries: any[] = [];
        for (const m of members ?? []) {
            try {
                const parsed = typeof m === 'string' ? JSON.parse(m) : m;
                const label: string = parsed?.testLabel ?? '';
                if (mode === 'random' && label !== 'Random Test') continue;
                if (mode === 'predefined' && label === 'Random Test') continue;
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
