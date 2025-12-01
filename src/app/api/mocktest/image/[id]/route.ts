import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { r2, R2_BUCKET_NAME } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';


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
                return new NextResponse(buffer as any, {
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

        // 2. Fetch from R2
        try {
            const command = new GetObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: imageId,
            });

            const response = await r2.send(command);
            if (!response.Body) {
                return NextResponse.json({ message: 'Image not found' }, { status: 404 });
            }

            // Convert stream to buffer
            const stream = response.Body as Readable;
            const chunks: Uint8Array[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            // 3. Store in Redis (Background)
            // Store as base64 string because Vercel KV (Redis) handles strings best.
            // TTL: 3600 seconds (1 hour)
            try {
                const base64Image = buffer.toString('base64');
                console.log(`Caching image ${imageId} to Redis...`);
                await redis.set(cacheKey, base64Image, { ex: 86400 });
                console.log(`Successfully cached image ${imageId}`);
            } catch (redisError) {
                console.error('Failed to cache image in Redis:', redisError);
            }

            return new NextResponse(buffer as any, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'X-Cache': 'MISS',
                },
            });

        } catch (error) {
            console.error('Failed to fetch image from R2:', error);
            // If R2 fails to find the object, it typically throws an error.
            // We can simplify the error handling here to just return 404 for any R2 fetch error.
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Failed to fetch image:', error);
        if (error instanceof Error && error.message.includes('not found')) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }
    }
}
