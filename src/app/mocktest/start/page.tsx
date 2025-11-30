'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2 } from 'lucide-react';
import { MockTestUI } from '@/components/mock-test-ui';
import type { Question } from '@/lib/types';

export default function MockTestStartPage() {
  const router = useRouter();
  const [setupData, setSetupData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('mockTestSetup');
    if (!data) {
      router.replace('/mocktest/setup');
      return;
    }
    setSetupData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    if (!setupData) return;

    async function fetchQuestions() {
      try {
        const response = await fetch('/api/mocktest/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions. Please try again.');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [setupData]);

  if (!setupData) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container py-8 text-center">
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-headline font-semibold">Generating Your Mock Test...</h1>
            <p className="text-muted-foreground">Please wait while we prepare the questions for you.</p>
          </>
        ) : error ? (
            <div className="text-destructive-foreground bg-destructive p-4 rounded-md">
              <h1 className="text-xl font-bold">Error</h1>
              <p>{error}</p>
            </div>
        ) : (
          <MockTestUI questions={questions} setupData={setupData} />
        )}
      </main>
      <Footer />
    </div>
  );
}
