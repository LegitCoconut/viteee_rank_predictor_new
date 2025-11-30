import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const MONGODB_DB = process.env.MONGODB_DB!;

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!params.id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }

        const client: MongoClient = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const bucket = new GridFSBucket(db);

        const downloadStream = bucket.openDownloadStream(new ObjectId(params.id));

        const chunks = [];
        for await (const chunk of downloadStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        // Assuming images are png, you might need to store mime-type in DB
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
            },
        });

    } catch (error) {
        console.error('Failed to fetch image:', error);
        if (error instanceof Error && error.message.includes('not found')) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
