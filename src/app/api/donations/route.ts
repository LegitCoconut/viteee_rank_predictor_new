import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';

const DonationSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  amount: z.number().int().positive().max(1000000),
  token: z.string().min(1),
});

const MONGODB_DB = process.env.MONGODB_DB!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, amount, token } = DonationSchema.parse(body);

    if (!(await verifyTurnstile(token, 'donation'))) {
      return NextResponse.json(
        { message: 'Invalid CAPTCHA token.' },
        { status: 400 },
      );
    }

    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('donations');

    const doc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount,
      currency: 'INR',
      status: 'claimed',
      // Thank-you mail delivery tracking - flipped by qp-cropper script.
      mailSent: false,
      mailSentAt: null,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(doc);

    return NextResponse.json(
      { message: 'Thanks - your donation record has been saved.', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', issues: error.issues },
        { status: 400 },
      );
    }
    console.error('donations POST failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
