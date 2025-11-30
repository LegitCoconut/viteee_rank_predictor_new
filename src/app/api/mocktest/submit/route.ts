import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { MongoClient } from 'mongodb';

const MONGODB_DB = process.env.MONGODB_DB!;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const client: MongoClient = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection('test-results');

        const result = await collection.insertOne(body);

        return NextResponse.json({ message: 'Test result saved successfully', insertedId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Failed to save test result:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
