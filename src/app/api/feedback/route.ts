import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  feedback: z.string().min(10),
  token: z.string(),
});

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;
const CLOUDFLARE_TURNSTILE_SECRET_KEY =
  process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!;

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(MONGODB_URI);
  cachedClient = await client.connect();
  return cachedClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = FormSchema.parse(body);

    const { name, email, feedback, token } = validatedData;

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${encodeURIComponent(
          CLOUDFLARE_TURNSTILE_SECRET_KEY
        )}&response=${encodeURIComponent(token)}`,
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { message: "Invalid CAPTCHA token." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const collection = db.collection("feedback");

    await collection.insertOne({
      name,
      email,
      feedback,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", issues: error.issues },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
