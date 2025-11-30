'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MockTestResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const resultData = sessionStorage.getItem('latestResult');
        if (!resultData) {
            router.replace('/mocktest');
        } else {
            setResult(JSON.parse(resultData));
            // Optional: clear the session storage after displaying to prevent re-display on refresh
            // sessionStorage.removeItem('latestResult');
        }
    }, [router]);

    if (!result) {
        return (
            <div className="flex flex-col min-h-dvh">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading results...</p>
                </main>
                <Footer />
            </div>
        );
    }
    
    const percentage = (result.score / result.totalQuestions) * 100;
    const incorrectAnswers = result.totalQuestions - result.score;

    return (
        <div className="flex flex-col min-h-dvh">
            <Header />
            <main className="flex-1 py-12">
                <div className="container max-w-4xl mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                            <Award className="h-16 w-16 mx-auto text-yellow-500" />
                            <CardTitle className="text-3xl font-headline mt-4">Test Completed!</CardTitle>
                            <CardDescription>Well done, {result.userId}! Here are your results.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-5xl font-bold">{result.score}<span className="text-2xl text-muted-foreground">/{result.totalQuestions}</span></p>
                                <p className="text-lg font-medium">Your Score</p>
                            </div>

                            <div className="space-y-2">
                                <Progress value={percentage} className="w-full" />
                                <p className="text-center text-muted-foreground">{percentage.toFixed(2)}% Correct</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                <Card className="p-4 bg-green-100 dark:bg-green-900/50">
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                        <p className="text-2xl font-bold">{result.score}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                                </Card>
                                 <Card className="p-4 bg-red-100 dark:bg-red-900/50">
                                    <div className="flex items-center justify-center gap-2">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                        <p className="text-2xl font-bold">{incorrectAnswers}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                                </Card>
                            </div>

                            <div className="text-center pt-4">
                                <Button asChild>
                                    <Link href="/mocktest">Take Another Test</Link>
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
