import { NextRequest, NextResponse } from "next/server";
import { trackAIUsage } from "@/lib/actions";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002";


const getCorsHeaders = (origin: string) => {
    const headers: { [key: string]: string } = {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
    if (origin === ALLOWED_ORIGIN) {
        headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    }
    return headers;
};


export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get("origin") ?? "";
    const headers = getCorsHeaders(origin);
    return NextResponse.json({}, { headers });
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? "";
    const headers = getCorsHeaders(origin);

    if (origin !== ALLOWED_ORIGIN) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403, headers });
    }

    try
    {
        // Fire-and-forget: No await here
        trackAIUsage();

        return NextResponse.json({ message: "AI usage tracking initiated." }, { status: 202, headers });
  } catch (error) {
    console.error("Error in AI usage tracking request:", error);
    // We don't want to expose internal errors, but we still send a response.
    // The actual processing is happening in the background.
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500, headers }
    );
  }
}
