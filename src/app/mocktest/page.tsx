'use client';

import { useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MockTestPattern } from '@/components/mock-test-pattern';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Pencil, ArrowDown, FileText } from 'lucide-react';
import { SyllabusSection } from '@/components/syllabus-section';
import { SyllabusDownloads } from '@/components/syllabus-downloads';

import { syllabus } from '@/lib/data/syllabus-data';
import Link from 'next/link';
import { PastResults } from '@/components/past-results';


export default function MockTestPage() {
  const syllabusRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const syllabusContext = JSON.stringify(syllabus);

  const handleScrollToSyllabus = () => {
    syllabusRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToPattern = () => {
    patternRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="h-dvh flex flex-col items-center justify-center text-center bg-secondary/50 relative">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold mb-4">VITEEE Mock Test</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Prepare for the VITEEE 2026 exam with our mock tests and resources.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <Button size="lg" className="w-[90%] sm:w-[280px]" asChild>
                <Link href="/mocktest/setup">
                  <Pencil className="mr-2 h-4 w-4" />
                  Take VITEEE Mock Test
                </Link>
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <Button size="lg" variant="outline" className="w-[90%] sm:w-[280px]" onClick={handleScrollToSyllabus}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Syllabus
                </Button>
                <Button size="lg" variant="outline" className="w-[90%] sm:w-[280px]" onClick={handleScrollToPattern}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Pattern
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 animate-bounce">
            <Button variant="ghost" size="icon" onClick={handleScrollToContent}>
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        </section>
        <div ref={contentRef}>
          <PastResults />
          <div ref={patternRef}>
            <MockTestPattern />
          </div>
        </div>
        <div ref={syllabusRef}>
          <SyllabusSection />
          <SyllabusDownloads />
        </div>
      </main>
      <Footer />
    </div>
  );
}
