import { NextRequest, NextResponse } from "next/server";
import { trackSyllabusDownload } from "@/lib/actions";

export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        // Fire-and-forget: No await here
        trackSyllabusDownload();

        return NextResponse.json({ message: "Syllabus download tracking initiated." }, { status: 202 });
    } catch (error) {
        console.error("Error in syllabus download tracking request:", error);
        // We don't want to expose internal errors, but we still send a response.
        // The actual processing is happening in the background.
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
