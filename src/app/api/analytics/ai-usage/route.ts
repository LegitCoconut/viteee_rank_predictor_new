import { NextRequest, NextResponse } from "next/server";
import { trackAIUsage } from "@/lib/actions";
import { updateDayWiseAnalytics } from "@/lib/analytics";

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    // Fire-and-forget: No await here
    trackAIUsage();
    updateDayWiseAnalytics('ai-usage');

    return NextResponse.json({ message: "AI usage tracking initiated." }, { status: 202 });
  } catch (error) {
    console.error("Error in AI usage tracking request:", error);
    // We don't want to expose internal errors, but we still send a response.
    // The actual processing is happening in the background.
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
