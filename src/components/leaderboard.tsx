'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal } from 'lucide-react';

interface Entry {
    examId: string;
    name: string;
    score: number;
    total: number;
    testLabel: string;
    timestamp: string;
}

function rankBadge(rank: number) {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-zinc-400" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />;
    return <span className="text-xs font-mono text-muted-foreground">#{rank}</span>;
}

export function Leaderboard() {
    const [entries, setEntries] = useState<Entry[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/mocktest/leaderboard', { cache: 'no-store' });
                const data: Entry[] = await res.json();
                if (!cancelled) setEntries(data);
            } catch {
                if (!cancelled) setEntries([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section id="leaderboard" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Trophy className="h-3.5 w-3.5" />
                        Leaderboard
                    </div>
                    <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Top 10 Scorers</h2>
                    <p className="text-sm md:text-lg text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto px-2">
                        The top ten scores across all mock tests. Beat them and your name lands here.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50 py-4">
                        <CardTitle className="text-base md:text-lg">Current Ranks</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Updated live as students submit tests.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
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
                                No results yet. Be the first to submit a test!
                            </div>
                        )}

                        {entries && entries.length > 0 && (
                            <ul className="divide-y divide-border/50">
                                {entries.map((e, idx) => {
                                    const rank = idx + 1;
                                    const percentage = e.total > 0 ? (e.score / e.total) * 100 : 0;
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
                                                    {e.score}/{e.total}
                                                </p>
                                                <p className="text-[11px] md:text-xs text-muted-foreground">
                                                    {percentage.toFixed(1)}%
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
