'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2 } from 'lucide-react';

export default function MockTestStartPage() {
  const router = useRouter();
  const [setupData, setSetupData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('mockTestSetup');
    if (!data) {
      router.replace('/mocktest/setup');
    } else {
      setSetupData(JSON.parse(data));
      // Simulate fetching questions
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Placeholder for actual API call
    }
  }, [router]);

  if (!setupData) {
    // This shows while checking session storage
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
        ) : (
          <>
            <h1 className="text-2xl font-bold">Mock Test Ready!</h1>
            <p>Welcome, {setupData.name}!</p>
            <p>Stream: {setupData.stream}</p>
            <div className="mt-8 p-8 border rounded-lg bg-secondary w-full max-w-4xl">
              <p className="text-center text-lg font-semibold">Test interface will be built here.</p>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
