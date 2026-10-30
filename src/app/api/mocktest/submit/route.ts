import { NextResponse } from 'next/server';
import { submitToLeaderboard } from '@/lib/leaderboard';

// Largest paper served: the predefined mock tests in Mongo are still the older 125-question sets (random tests are 100).
// Marks are +4/-1 per question, so maxMarks = total * 4 and the board ranks by percentage.
const MAX_QUESTIONS = 125;
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const name = String(body.userId ?? '').trim().slice(0, 40);
        const score = Number(body.score);
        const wrong = Number(body.wrong);
        const total = Number(body.totalQuestions);
        const valid =
            name &&
            Number.isInteger(score) && Number.isInteger(wrong) && Number.isInteger(total) &&
            score >= 0 && wrong >= 0 && total > 0 && total <= MAX_QUESTIONS &&
            score + wrong <= total;
        if (!valid) {
            return NextResponse.json({ message: 'Invalid result' }, { status: 400 });
        }

        // Marks are recomputed here; the client's own marks/maxMarks are ignored.
        const marks = score * MARK_CORRECT + wrong * MARK_WRONG;
        const maxMarks = total * MARK_CORRECT;
        const predefined = body.mode === 'predefined' && body.predefinedId;

        // Zero or negative scores never reach the board.
        const added =
            marks > 0 &&
            (await submitToLeaderboard(predefined ? 'predefined' : 'random', {
                examId: typeof body.examId === 'string' ? body.examId : undefined,
                name,
                score,
                wrong,
                marks,
                maxMarks,
                total,
                testLabel: predefined ? String(body.predefinedName || `Mock Test ${body.predefinedId}`) : 'Random Test',
                timestamp: new Date().toISOString(),
            }));

        return NextResponse.json({ message: 'Test result received', onLeaderboard: added }, { status: 201 });
    } catch (error) {
        console.error('Failed to process test result:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
