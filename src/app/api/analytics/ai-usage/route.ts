import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002";


let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(MONGODB_URI);
  cachedClient = await client.connect();
  return cachedClient;
}

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

    try {
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection("analytics");
    
        // Fire-and-forget: No await here
        collection.findOneAndUpdate(
            { type: 'ai-usage' },
            { $inc: { count: 1 } },
            { upsert: true }
        );

        return NextResponse.json({ message: "AI usage tracking initiated." }, { status: 202, headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500, headers }
    );
  }
}
