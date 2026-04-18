"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { History, Trophy, Trash2, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const subjectNames: { [key: string]: string } = {
    maths: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    apt_eng: 'Aptitude & English'
};

type StoredResult = {
    examId: string;
    timestamp: string;
    score: number;
    wrong?: number;
    marks?: number;
    maxMarks?: number;
    totalQuestions: number;
    answers?: Array<{ status?: string }>;
    sectionScores?: Record<
        string,
        { score: number; wrong?: number; total: number }
    >;
    mode?: 'random' | 'predefined';
    predefinedId?: number;
    predefinedName?: string;
};

// VITEEE-style marking scheme — mirrors mock-test-ui / results page.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

function deriveMarks(result: StoredResult) {
    const attempted =
        result.answers?.filter((a) => a.status === 'answered').length ?? 0;
    const wrong =
        typeof result.wrong === 'number'
            ? result.wrong
            : Math.max(attempted - result.score, 0);
    const marks =
        typeof result.marks === 'number'
            ? result.marks
            : result.score * MARK_CORRECT + wrong * MARK_WRONG;
    const maxMarks =
        typeof result.maxMarks === 'number' && result.maxMarks > 0
            ? result.maxMarks
            : result.totalQuestions * MARK_CORRECT;
    return { wrong, marks, maxMarks };
}

export function PastResults() {
    const [results, setResults] = useState<StoredResult[]>([]);

    useEffect(() => {
        const storedResults = localStorage.getItem('mockTestResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
    }, []);

    const deleteResult = (examId: string) => {
        const next = results.filter(r => r.examId !== examId);
        setResults(next);
        localStorage.setItem('mockTestResults', JSON.stringify(next));
        try {
            const raw = localStorage.getItem('mockTestQuestions');
            if (raw) {
                const map = JSON.parse(raw) as Record<string, unknown>;
                if (examId in map) {
                    delete map[examId];
                    localStorage.setItem('mockTestQuestions', JSON.stringify(map));
                }
            }
        } catch {
            // Stale snapshot map — not worth surfacing to the user.
        }
    };

    const deleteAllResults = () => {
        setResults([]);
        localStorage.removeItem('mockTestResults');
        localStorage.removeItem('mockTestQuestions');
    };

    if (results.length === 0) {
        return null;
    }

    return (
        <section id="past-results" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3 md:mb-4">
                        <Trophy className="h-3.5 w-3.5" />
                        Your Progress
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Past Results</h2>
                    <p className="text-sm md:text-lg text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto px-2">
                        Review your previous mock test performances.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <CardTitle className="flex items-center gap-2.5 text-lg">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
                                        <History className="h-4 w-4 text-primary" />
                                    </div>
                                    Test History
                                </CardTitle>
                                <CardDescription className="mt-1.5">Click on a test to view section-wise details.</CardDescription>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1.5 shrink-0">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Clear All</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Clear all test history?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This removes all {results.length} local result{results.length === 1 ? '' : 's'} from your browser. Server-side records and the leaderboard are unaffected. This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={deleteAllResults}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Clear All
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                        {results.map((result, index) => {
                            const { wrong, marks, maxMarks } = deriveMarks(result);
                            const percentage = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
                            const progressPct = Math.max(0, Math.min(100, percentage));
                            const testLabel = result.mode === 'predefined' && result.predefinedId
                                ? (result.predefinedName || `Mock Test ${result.predefinedId}`)
                                : 'Random Test';
                            return (
                                <AccordionItem value={`item-${index}`} key={result.examId} className="border-b border-border/50 last:border-0">
                                    <AccordionTrigger className="hover:no-underline px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center justify-between w-full pr-2 md:pr-4 gap-2 md:gap-4">
                                            <div className="text-left min-w-0">
                                                <p className="text-sm font-medium truncate">{testLabel}</p>
                                                <p className="font-mono text-[11px] text-muted-foreground mt-0.5 truncate">{result.examId}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{new Date(result.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                                <div className="w-16 md:w-24 hidden sm:block">
                                                    <Progress value={progressPct} className="h-2" />
                                                </div>
                                                <div className="text-right whitespace-nowrap">
                                                    <span className="font-semibold text-sm md:text-base">{marks}<span className="text-muted-foreground">/{maxMarks}</span></span>
                                                    <span className="block text-[10px] text-muted-foreground font-mono">{result.score}C · {wrong}W</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="mx-4 md:mx-6 mb-4 p-3 md:p-4 bg-muted/30 rounded-lg space-y-3">
                                            <h4 className="font-semibold text-sm">Section-wise Score</h4>
                                            {result.sectionScores && Object.entries(result.sectionScores).map(([subject, scores]: [string, any]) => {
                                                if (!scores || scores.total <= 0) return null;
                                                const sWrong = typeof scores.wrong === 'number' ? scores.wrong : 0;
                                                const sMarks = scores.score * MARK_CORRECT + sWrong * MARK_WRONG;
                                                const sMax = scores.total * MARK_CORRECT;
                                                const sPct = sMax > 0 ? Math.max(0, Math.min(100, (sMarks / sMax) * 100)) : 0;
                                                return (
                                                    <div key={subject} className="flex items-center justify-between gap-4">
                                                        <span className="text-xs md:text-sm text-muted-foreground">{subjectNames[subject] || subject}</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-16 md:w-20">
                                                                <Progress value={sPct} className="h-1.5" />
                                                            </div>
                                                            <span className="text-xs md:text-sm font-medium w-16 md:w-20 text-right">{sMarks}<span className="text-muted-foreground">/{sMax}</span></span>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <div className="pt-3 border-t border-border/50 flex flex-wrap justify-end items-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 h-8"
                                                >
                                                    <Link href={`/mocktest/results/detailed?examId=${encodeURIComponent(result.examId)}`}>
                                                        <FileText className="h-3.5 w-3.5" />
                                                        View detailed
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 h-8">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete this result?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This removes {testLabel} ({marks}/{maxMarks} marks) from your local history. Server-side records and the leaderboard are unaffected. This cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => deleteResult(result.examId)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
