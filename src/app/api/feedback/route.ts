import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { verifyTurnstile } from "@/lib/turnstile";

const FormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  feedback: z.string().min(10),
  token: z.string(),
});

const MONGODB_DB = process.env.MONGODB_DB!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = FormSchema.parse(body);

    const { name, email, feedback, token } = validatedData;

    if (!(await verifyTurnstile(token, "feedback"))) {
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
