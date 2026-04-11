"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { History } from 'lucide-react';

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
        return null; // Don't render the component if there are no results
    }

    return (
        <section id="past-results" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">Past Results</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Review your previous mock test performances.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History /> Your Test History</CardTitle>
                        <CardDescription>Click on a test to view section-wise details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                        {results.map((result, index) => (
                            <AccordionItem value={`item-${index}`} key={result.examId}>
                                <AccordionTrigger className="hover:no-underline">
                                    <Table className="w-full">
                                        <TableBody>
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell className="font-mono text-xs text-muted-foreground w-1/3 truncate">{result.examId}</TableCell>
                                                <TableCell className="w-1/3 text-center">{new Date(result.timestamp).toLocaleDateString()}</TableCell>
                                                <TableCell className="w-1/3 text-right font-bold text-lg">{result.score} / {result.totalQuestions}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="px-4 py-2 bg-muted/50 rounded-md">
                                        <h4 className="font-semibold mb-2">Section-wise Score</h4>
                                        <ul className="space-y-1 text-sm">
                                            {result.sectionScores && Object.entries(result.sectionScores).map(([subject, scores]: [string, any]) => (
                                                scores.total > 0 && (
                                                    <li key={subject} className="flex justify-between">
                                                        <span>{subjectNames[subject] || subject}</span>
                                                        <span className="font-medium">{scores.score} / {scores.total}</span>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
