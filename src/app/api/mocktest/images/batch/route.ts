import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { r2, R2_BUCKET_NAME } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function POST(request: Request) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Invalid or empty IDs array' }, { status: 400 });
        }

        const images: Record<string, string | null> = {};
        const uncachedIds: string[] = [];

        // 1. Check Redis for all IDs
        // Pipeline for efficiency
        const pipeline = redis.pipeline();
        ids.forEach(id => pipeline.get(`vit_ranks_cache:image:${id}`));
        const cachedResults = await pipeline.exec();

        ids.forEach((id, index) => {
            const result = cachedResults[index];
            // Upstash/Redis returns null if key doesn't exist.
            // result is the value directly if using @upstash/redis
            if (result) {
                images[id] = result as string;
            } else {
                uncachedIds.push(id);
            }
        });

        // 2. Fetch uncached images from R2
        if (uncachedIds.length > 0) {
            const fetchPromises = uncachedIds.map(async (id) => {
                try {
                    const command = new GetObjectCommand({
                        Bucket: R2_BUCKET_NAME,
                        Key: id, // Assuming ID maps directly to Key
                    });

                    const response = await r2.send(command);
                    if (!response.Body) {
                        console.warn(`Image not found in R2: ${id}`);
                        images[id] = null;
                        return;
                    }

                    // Convert stream to buffer/base64
                    const stream = response.Body as Readable;
                    const chunks: Uint8Array[] = [];
                    for await (const chunk of stream) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);
                    const base64Image = buffer.toString('base64');

                    images[id] = base64Image;

                    // 3. Cache in Redis (Background-ish)
                    // We await here to ensure data consistency for this request, 
                    // but could be fire-and-forget if speed is critical.
                    // TTL: 24 hours (86400 seconds)
                    await redis.set(`vit_ranks_cache:image:${id}`, base64Image, { ex: 86400 });

                } catch (error) {
                    console.error(`Failed to fetch image ${id} from R2:`, error);
                    images[id] = null;
                }
            });

            await Promise.all(fetchPromises);
        }

        return NextResponse.json({ images });

    } catch (error) {
        console.error('Batch image fetch error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
