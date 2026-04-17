import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';

const BodySchema = z.object({
    email: z.string().email(),
    name: z.string().max(120).optional(),
    source: z.string().max(60).optional(),
});

const MONGODB_DB = process.env.MONGODB_DB!;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid payload', issues: parsed.error.issues },
                { status: 400 },
            );
        }

        const { email, name, source } = parsed.data;
        const normalizedEmail = email.trim().toLowerCase();

        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection('subscribers');

        // Silently no-op if the email is already in the list.
        const existing = await collection.findOne(
            { email: normalizedEmail },
            { projection: { _id: 1 } },
        );
        if (!existing) {
            await collection.insertOne({
                email: normalizedEmail,
                name: name ?? null,
                source: source ?? null,
                createdAt: new Date(),
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to save subscriber:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
