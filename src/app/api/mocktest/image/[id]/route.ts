import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { redis } from '@/lib/redis';
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

        const imageId = params.id;
        const cacheKey = `vit_ranks_cache:image:${imageId}`;

        // 1. Check Redis Cache
        try {
            const cachedImage = await redis.get<string>(cacheKey);
            if (cachedImage) {
                // Redis returns the data as a string (base64 or similar depending on storage), 
                // but here we likely stored it as a buffer or base64 string.
                // For simplicity with Vercel KV, we'll assume we stored it as a base64 string.
                const buffer = Buffer.from(cachedImage, 'base64');
                return new NextResponse(buffer, {
                    status: 200,
                    headers: {
                        'Content-Type': 'image/png',
                        'Cache-Control': 'public, max-age=31536000, immutable',
                        'X-Cache': 'HIT',
                    },
                });
            }
        } catch (redisError) {
            console.error('Redis cache error:', redisError);
            // Continue to fetch from DB if Redis fails
        }

        // 2. Fetch from MongoDB
        const client: MongoClient = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const bucket = new GridFSBucket(db);

        const objectId = new ObjectId(imageId);

        const files = await bucket.find({ _id: objectId }).limit(1).toArray();
        if (!files.length) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }

        const downloadStream = bucket.openDownloadStream(objectId);

        // We need to buffer the stream to store it in Redis
        const chunks: Uint8Array[] = [];
        for await (const chunk of downloadStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // 3. Store in Redis (Background)
        // Store as base64 string because Vercel KV (Redis) handles strings best.
        // TTL: 3600 seconds (1 hour)
        try {
            const base64Image = buffer.toString('base64');
            // Use set with EX (expiration) option
            // We don't await this to avoid blocking the response, 
            // BUT in serverless, the process might freeze. 
            // Ideally use `waitUntil` if available, or just await it to be safe.
            await redis.set(cacheKey, base64Image, { ex: 3600 });
        } catch (redisError) {
            console.error('Failed to cache image in Redis:', redisError);
        }

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Cache': 'MISS',
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
