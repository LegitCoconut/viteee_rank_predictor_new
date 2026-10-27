import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackMockTestStart } from "@/lib/actions";
import { updateDayWiseAnalytics } from "@/lib/analytics";
import { connectToDatabase } from "@/lib/db";
import { verifyTurnstile } from "@/lib/turnstile";

const BodySchema = z.object({
    token: z.string().min(1),
    subscriber: z
        .object({
            email: z.string().email(),
            name: z.string().max(120).optional(),
            source: z.string().max(60).optional(),
        })
        .optional(),
});

const MONGODB_DB = process.env.MONGODB_DB!;

export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const parsed = BodySchema.safeParse(await req.json().catch(() => null));
        if (!parsed.success || !(await verifyTurnstile(parsed.data.token, "mocktest-setup"))) {
            return NextResponse.json({ message: "Invalid CAPTCHA token." }, { status: 400 });
        }
        const { subscriber } = parsed.data;

        // Fire-and-forget: No await here
        trackMockTestStart();
        updateDayWiseAnalytics('mocktest-start');

        if (subscriber) {
            const email = subscriber.email.trim().toLowerCase();
            const collection = (await connectToDatabase()).db(MONGODB_DB).collection("subscribers");
            // Silently no-op if the email is already in the list.
            if (!(await collection.findOne({ email }, { projection: { _id: 1 } }))) {
                await collection.insertOne({
                    email,
                    name: subscriber.name ?? null,
                    source: subscriber.source ?? null,
                    createdAt: new Date(),
                });
            }
        }

        return NextResponse.json({ message: "Mock test start tracking initiated." }, { status: 202 });
    } catch (error) {
        console.error("Error in mock test start tracking request:", error);
        // We don't want to expose internal errors, but we still send a response.
        // The actual processing is happening in the background.
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
