"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { History, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const subjectNames: { [key: string]: string } = {
    maths: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    apt_eng: 'Aptitude & English'
};

export function PastResults() {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const storedResults = localStorage.getItem('mockTestResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
    }, []);

    if (results.length === 0) {
        return null;
    }

    return (
        <section id="past-results" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Trophy className="h-3.5 w-3.5" />
                        Your Progress
                    </div>
                    <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Past Results</h2>
                    <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                        Review your previous mock test performances.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="flex items-center gap-2.5 text-lg">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                                <History className="h-4 w-4 text-primary" />
                            </div>
                            Test History
                        </CardTitle>
                        <CardDescription>Click on a test to view section-wise details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                        {results.map((result, index) => {
                            const percentage = result.totalQuestions > 0 ? (result.score / result.totalQuestions) * 100 : 0;
                            return (
                                <AccordionItem value={`item-${index}`} key={result.examId} className="border-b border-border/50 last:border-0">
                                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                                        <div className="flex items-center justify-between w-full pr-4 gap-4">
                                            <div className="text-left">
                                                <p className="text-sm font-medium">
                                                    {result.mode === 'predefined' && result.predefinedId
                                                        ? (result.predefinedName || `Mock Test ${result.predefinedId}`)
                                                        : 'Random Test'}
                                                </p>
                                                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{result.examId}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{new Date(result.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 hidden sm:block">
                                                    <Progress value={percentage} className="h-2" />
                                                </div>
                                                <span className="font-semibold text-base whitespace-nowrap">{result.score}/{result.totalQuestions}</span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="mx-6 mb-4 p-4 bg-muted/30 rounded-lg space-y-3">
                                            <h4 className="font-semibold text-sm">Section-wise Score</h4>
                                            {result.sectionScores && Object.entries(result.sectionScores).map(([subject, scores]: [string, any]) => (
                                                scores.total > 0 && (
                                                    <div key={subject} className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-muted-foreground">{subjectNames[subject] || subject}</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-20">
                                                                <Progress value={(scores.score / scores.total) * 100} className="h-1.5" />
                                                            </div>
                                                            <span className="text-sm font-medium w-14 text-right">{scores.score}/{scores.total}</span>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
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
