'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Medal, Shuffle, ListChecks } from 'lucide-react';

interface Entry {
    examId: string;
    name: string;
    score: number;
    wrong?: number;
    marks?: number;
    maxMarks?: number;
    total: number;
    testLabel: string;
    timestamp: string;
}

interface LeaderboardProps {
    mode: 'random' | 'predefined';
    entries: Entry[] | null; // null while the parent is still loading
}

const MARK_CORRECT = 4;
const MARK_WRONG = -1;

function marksOf(e: Entry): { marks: number; maxMarks: number; pct: number } {
    const marks =
        typeof e.marks === 'number'
            ? e.marks
            : e.score * MARK_CORRECT + (e.wrong ?? 0) * MARK_WRONG;
    const maxMarks =
        typeof e.maxMarks === 'number' && e.maxMarks > 0
            ? e.maxMarks
            : e.total * MARK_CORRECT;
    const pct = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
    return { marks, maxMarks, pct };
}

function rankBadge(rank: number) {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-zinc-400" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />;
    return <span className="text-xs font-mono text-muted-foreground">#{rank}</span>;
}

const BOARD_META = {
    random: {
        title: 'Random Tests',
        description: 'All-time top 10 from randomised 100-question tests.',
        icon: Shuffle,
        empty: 'No random test results yet.',
    },
    predefined: {
        title: 'Mock Tests',
        description: 'Today\u2019s top 10 across curated mock tests. Resets daily at midnight IST.',
        icon: ListChecks,
        empty: 'No mock test results yet.',
    },
};

export function Leaderboard({ mode, entries }: LeaderboardProps) {
    const meta = BOARD_META[mode];
    const Icon = meta.icon;

    return (
        <Card className="border-border/50 shadow-xs h-full flex flex-col">
            <CardHeader className="border-b border-border/50 py-4">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base md:text-lg">{meta.title}</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">{meta.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {entries === null && (
                    <ul className="divide-y divide-border/50">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="px-4 md:px-6 py-3 flex items-center gap-3">
                                <div className="h-4 w-6 rounded bg-muted animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                                    <div className="h-2 w-20 rounded bg-muted animate-pulse" />
                                </div>
                                <div className="h-4 w-10 rounded bg-muted animate-pulse" />
                            </li>
                        ))}
                    </ul>
                )}

                {entries?.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        {meta.empty}
                    </div>
                )}

                {entries && entries.length > 0 && (
                    <ul className="divide-y divide-border/50">
                        {entries.map((e, idx) => {
                            const rank = idx + 1;
                            const { marks, maxMarks, pct } = marksOf(e);
                            return (
                                <li
                                    key={e.examId ?? idx}
                                    className="px-4 md:px-6 py-3 flex items-center gap-3 md:gap-4"
                                >
                                    <div className="flex items-center justify-center w-6 md:w-8 shrink-0">
                                        {rankBadge(rank)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm md:text-base font-medium truncate">{e.name}</p>
                                        <p className="text-[11px] md:text-xs text-muted-foreground truncate">
                                            {e.testLabel}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm md:text-base font-semibold whitespace-nowrap">
                                            {marks}<span className="text-muted-foreground">/{maxMarks}</span>
                                        </p>
                                        <p className="text-[11px] md:text-xs text-muted-foreground">
                                            {pct.toFixed(1)}% · {e.score}C
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
