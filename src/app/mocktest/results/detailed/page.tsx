'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, MinusCircle, ChevronLeft, Filter } from 'lucide-react';
import type { Answer, QuestionWithImage } from '@/lib/types';

const subjectNames: Record<string, string> = {
    maths: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    apt_eng: 'Aptitude & English',
};

type FilterKey = 'all' | 'correct' | 'incorrect' | 'unanswered';

interface StoredResult {
    examId: string;
    score: number;
    totalQuestions: number;
    answers: Answer[];
    mode?: 'random' | 'predefined';
    predefinedName?: string;
}

export default function DetailedResultsPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<QuestionWithImage[] | null>(null);
    const [result, setResult] = useState<StoredResult | null>(null);
    const [filter, setFilter] = useState<FilterKey>('all');

    useEffect(() => {
        try {
            const rawResult = sessionStorage.getItem('latestResult');
            const rawQuestions = sessionStorage.getItem('latestQuestions');
            if (!rawResult || !rawQuestions) {
                router.replace('/mocktest');
                return;
            }
            setResult(JSON.parse(rawResult));
            setQuestions(JSON.parse(rawQuestions));
        } catch {
            router.replace('/mocktest');
        }
    }, [router]);

    const rows = useMemo(() => {
        if (!questions || !result) return [];
        const answerByQid = new Map(result.answers.map(a => [a.questionId, a]));
        return questions.map((q, index) => {
            const ans = answerByQid.get(q._id);
            const chosen = ans?.answer ?? null;
            const verdict: 'correct' | 'incorrect' | 'unanswered' = chosen === null
                ? 'unanswered'
                : chosen === q.correct_option ? 'correct' : 'incorrect';
            return { index, question: q, chosen, verdict };
        });
    }, [questions, result]);

    const filtered = useMemo(
        () => (filter === 'all' ? rows : rows.filter(r => r.verdict === filter)),
        [rows, filter],
    );

    const counts = useMemo(() => ({
        all: rows.length,
        correct: rows.filter(r => r.verdict === 'correct').length,
        incorrect: rows.filter(r => r.verdict === 'incorrect').length,
        unanswered: rows.filter(r => r.verdict === 'unanswered').length,
    }), [rows]);

    if (!questions || !result) {
        return (
            <div className="flex flex-col min-h-dvh">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading detailed results...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const title = result.mode === 'predefined' && result.predefinedName ? result.predefinedName : 'Random Test';

    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1 py-10">
                <div className="container max-w-4xl mx-auto px-4 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2 mb-1">
                                <Link href="/mocktest/results"><ChevronLeft className="h-4 w-4" /> Back to summary</Link>
                            </Button>
                            <h1 className="text-2xl md:text-3xl font-headline font-semibold">Detailed Results</h1>
                            <p className="text-sm text-muted-foreground">
                                {title} · Score {result.score}/{result.totalQuestions}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-4 flex flex-wrap gap-2 items-center">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
                                <Filter className="h-3.5 w-3.5" /> Filter:
                            </div>
                            {(['all', 'correct', 'incorrect', 'unanswered'] as FilterKey[]).map(key => (
                                <Button
                                    key={key}
                                    size="sm"
                                    variant={filter === key ? 'default' : 'outline'}
                                    onClick={() => setFilter(key)}
                                    className="capitalize gap-1.5"
                                >
                                    {key} <span className="text-xs opacity-70">({counts[key]})</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        {filtered.map(row => (
                            <QuestionReviewCard key={row.question._id} row={row} />
                        ))}
                        {filtered.length === 0 && (
                            <Card>
                                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                                    No questions match this filter.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function QuestionReviewCard({ row }: { row: { index: number; question: QuestionWithImage; chosen: string | null; verdict: 'correct' | 'incorrect' | 'unanswered' } }) {
    const { index, question, chosen, verdict } = row;
    const verdictStyles = {
        correct: { icon: CheckCircle2, colorClass: 'text-green-600 dark:text-green-500', borderClass: 'border-green-500/40', bgClass: 'bg-green-50/60 dark:bg-green-950/20', label: 'Correct' },
        incorrect: { icon: XCircle, colorClass: 'text-red-600 dark:text-red-500', borderClass: 'border-red-500/40', bgClass: 'bg-red-50/60 dark:bg-red-950/20', label: 'Incorrect' },
        unanswered: { icon: MinusCircle, colorClass: 'text-muted-foreground', borderClass: 'border-border', bgClass: '', label: 'Not answered' },
    }[verdict];
    const Icon = verdictStyles.icon;

    return (
        <Card className={`${verdictStyles.borderClass} ${verdictStyles.bgClass}`}>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">Q{index + 1}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{subjectNames[question.subject] || question.subject}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${verdictStyles.colorClass}`}>
                        <Icon className="h-4 w-4" />
                        {verdictStyles.label}
                    </div>
                </div>

                {question.imageUrl ? (
                    <div className="relative w-full rounded-md border overflow-hidden bg-white">
                        <Image
                            src={question.imageUrl}
                            alt={`Question ${index + 1}`}
                            width={800}
                            height={400}
                            className="w-full h-auto"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic">(image unavailable)</div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Your answer</p>
                        <p className="font-mono font-semibold uppercase">{chosen ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Correct answer</p>
                        <p className="font-mono font-semibold uppercase">{question.correct_option}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
