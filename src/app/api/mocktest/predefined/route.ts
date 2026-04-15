import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import type { PredefinedMockTestSummary } from '@/lib/types';

const MONGODB_DB = process.env.MONGODB_DB!;
const ACTIVE_KEY = 'mocktest:predefined:active';

async function loadFromMongo(): Promise<PredefinedMockTestSummary[]> {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const docs = await db
        .collection('mocktests')
        .find({}, { projection: { _id: 1, name: 1, active: 1 } })
        .sort({ _id: 1 })
        .toArray();

    return docs.map(d => ({
        id: d._id as unknown as number,
        name: d.name,
        active: !!d.active,
    }));
}

export async function GET() {
    try {
        try {
            const cached = await redis.get<PredefinedMockTestSummary[] | string>(ACTIVE_KEY);
            if (cached) {
                const list = typeof cached === 'string' ? JSON.parse(cached) : cached;
                return NextResponse.json(list);
            }
        } catch (err) {
            console.error('Redis read failed for predefined list:', err);
        }

        const list = await loadFromMongo();

        try {
            await redis.set(ACTIVE_KEY, list);
        } catch (err) {
            console.error('Redis write failed for predefined list:', err);
        }

        return NextResponse.json(list);
    } catch (error) {
        console.error('Failed to load predefined mock tests:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
