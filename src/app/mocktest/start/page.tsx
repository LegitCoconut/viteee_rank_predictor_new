'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2 } from 'lucide-react';

export default function MockTestStartPage() {
  const router = useRouter();
  const [setupData, setSetupData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('mockTestSetup');
    if (!data) {
      // If no setup data is found, redirect back to the setup page
      router.replace('/mocktest/setup');
    } else {
      setSetupData(JSON.parse(data));
    }
  }, [router]);

  if (!setupData) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold">Mock Test Started!</h1>
        <p>Welcome, {setupData.name}!</p>
        <p>Stream: {setupData.stream}</p>
        <div className="mt-8 p-8 border rounded-lg bg-secondary">
          <p className="text-center text-lg font-semibold">Test interface will be built here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
