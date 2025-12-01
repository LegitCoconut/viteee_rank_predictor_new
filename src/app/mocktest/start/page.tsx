'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2, CheckCircle } from 'lucide-react';
import { MockTestUI } from '@/components/mock-test-ui';
import type { QuestionWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function MockTestStartPage() {
  const router = useRouter();
  const [setupData, setSetupData] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionWithImage[]>([]);
  const [loadingState, setLoadingState] = useState<'fetching' | 'preloading' | 'ready' | 'error'>('fetching');
  const [error, setError] = useState<string | null>(null);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);

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

    async function fetchAndPreload() {
      try {
        setLoadingState('fetching');
        const response = await fetch('/api/mocktest/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions. Please try again.');
        }
        const data: QuestionWithImage[] = await response.json();

        if (data.length < 125) {
          throw new Error(`Failed to load all questions. Only got ${data.length}/125.`);
        }

        setLoadingState('preloading');

        let loadedCount = 0;
        let loadedCount = 0;
        const concurrencyLimit = 5; // Fetch 5 images at a time
        let currentIndex = 0;
        const questionsWithImages: QuestionWithImage[] = [];

        while (currentIndex < data.length) {
          const batch = data.slice(currentIndex, currentIndex + concurrencyLimit);

          const batchResults = await Promise.all(batch.map(async (question) => {
            try {
              const imageUrl = `/api/mocktest/image/${question.image_id}`;
              const imageResponse = await fetch(imageUrl);
              if (!imageResponse.ok) {
                throw new Error(`Failed to fetch image ${question.image_id}`);
              }
              const blob = await imageResponse.blob();
              const blobUrl = URL.createObjectURL(blob);

              loadedCount++;
              setPreloadProgress((loadedCount / data.length) * 100);

              return { ...question, imageUrl: blobUrl };
            } catch (imgError) {
              console.error(`Failed to load image for question ${question._id}:`, imgError);
              loadedCount++;
              setPreloadProgress((loadedCount / data.length) * 100);
              return { ...question, imageUrl: '' };
            }
          }));

          questionsWithImages.push(...batchResults);
          currentIndex += concurrencyLimit;
        }

        setQuestions(questionsWithImages);
        setLoadingState('ready');
      } catch (err: any) {
        setError(err.message);
        setLoadingState('error');
      }
    }

    fetchAndPreload();
  }, [setupData]);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      questions.forEach(q => {
        if (q.imageUrl && q.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(q.imageUrl);
        }
      });
    };
  }, [questions]);


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

  if (isTestStarted) {
    return <MockTestUI questions={questions} setupData={setupData} />;
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container py-8 text-center">
        {loadingState === 'fetching' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-headline font-semibold">Generating Your Mock Test...</h1>
            <p className="text-muted-foreground">Please wait while we prepare the questions for you.</p>
          </>
        )}
        {loadingState === 'preloading' && (
          <div className="w-full max-w-md flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-headline font-semibold">Loading Test Assets...</h1>
            <p className="text-muted-foreground mb-4">This will ensure a smooth testing experience.</p>
            <Progress value={preloadProgress} className="w-full" />
            <p className="text-sm mt-2">{Math.round(preloadProgress)}%</p>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
              All these services are running on free tier platforms and servers in order to make it ad free and to give a seamless experience. So the test will take some time to get loaded.
            </p>
          </div>
        )}
        {loadingState === 'ready' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-headline font-semibold">Your test is ready!</h1>
            <p className="text-muted-foreground">The test will start in fullscreen mode.</p>
            <Button size="lg" onClick={() => setIsTestStarted(true)}>
              Start Test
            </Button>
          </div>
        )}
        {loadingState === 'error' && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">
            <h1 className="text-xl font-bold">Error</h1>
            <p>{error}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
