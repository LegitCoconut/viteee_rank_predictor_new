import { connectToDatabase } from "@/lib/db";

const MONGODB_DB = process.env.MONGODB_DB!;

export async function updateDayWiseAnalytics(metric: 'syllabus-download' | 'mocktest-start') {
    try {
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection('day-wise-analytics');

        // Get current date in IST (Indian Standard Time)
        const date = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Kolkata',
        }); // Returns YYYY-MM-DD format

        await collection.updateOne(
            { date: date },
            {
                $inc: { [metric]: 1 },
                $setOnInsert: { date: date } // Ensure date is set on insert
            },
            { upsert: true }
        );
    } catch (error) {
        console.error(`Failed to update day-wise analytics for ${metric}:`, error);
    }
}
