import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/leaderboard';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const split = searchParams.get('split') === 'true';

    try {
        if (split) {
            const [random, predefined] = await Promise.all([getLeaderboard('random'), getLeaderboard('predefined')]);
            return NextResponse.json({ random, predefined });
        }
        return NextResponse.json(await getLeaderboard(searchParams.get('mode') === 'predefined' ? 'predefined' : 'random'));
    } catch (error) {
        console.error('Failed to read leaderboard:', error);
        return NextResponse.json(split ? { random: [], predefined: [] } : []);
    }
}
