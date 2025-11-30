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

        const objectId = new ObjectId(params.id);

        // Check if file exists first to avoid opening stream for non-existent file
        const files = await bucket.find({ _id: objectId }).limit(1).toArray();
        if (!files.length) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }

        const downloadStream = bucket.openDownloadStream(objectId);

        // Create a ReadableStream from the GridFS download stream
        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (err) => controller.error(err));
            },
        });

        return new NextResponse(stream, {
            status: 200,
            headers: {
                'Content-Type': 'image/png', // Ideally, get this from file metadata
                'Cache-Control': 'public, max-age=31536000, immutable',
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
