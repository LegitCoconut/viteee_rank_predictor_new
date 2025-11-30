"use server";

import { connectToDatabase } from "./db";

const MONGODB_DB = process.env.MONGODB_DB;
if (!MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable inside .env");
}

export async function trackSyllabusDownload() {
    try {
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection("analytics");

        await collection.findOneAndUpdate(
            { type: "syllabus-download" },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Failed to track syllabus download:", error);
    }
}

export async function trackAIUsage() {
    try {
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection("analytics");

        await collection.findOneAndUpdate(
            { type: "ai-usage" },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Failed to track AI usage:", error);
    }
}

export async function trackMockTestStart() {
    try {
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        const collection = db.collection("analytics");

        await collection.findOneAndUpdate(
            { type: "mocktest-start" },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Failed to track mock test start:", error);
    }
}
