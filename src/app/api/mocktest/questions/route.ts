import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

const MONGODB_DB = process.env.MONGODB_DB!;

async function getQuestionsFromCollection(collectionName: string, count: number) {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const collection = db.collection(collectionName);
    
    // Using aggregation to get random documents
    const questions = await collection.aggregate([
        { $sample: { size: count } }
    ]).toArray();

    return questions.map(q => ({
        _id: q._id.toHexString(),
        image_id: q.image_id.toHexString(),
        correct_option: q.correct_option,
        subject: collectionName,
    }));
}

export async function GET() {
    try {
        const mathQuestions = await getQuestionsFromCollection('maths', 40);
        const physicsQuestions = await getQuestionsFromCollection('physics', 35);
        const chemistryQuestions = await getQuestionsFromCollection('chemistry', 35);
        const englishAptitudeQuestions = await getQuestionsFromCollection('apt_english', 15);
        
        const allQuestions = [
            ...mathQuestions,
            ...physicsQuestions,
            ...chemistryQuestions,
            ...englishAptitudeQuestions
        ];

        // Shuffle all questions
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

        return NextResponse.json(shuffledQuestions);
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
