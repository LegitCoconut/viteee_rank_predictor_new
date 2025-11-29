'use client';

import { useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MockTestPattern } from '@/components/mock-test-pattern';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Pencil } from 'lucide-react';
import { SyllabusSection } from '@/components/syllabus-section';
import { AIChatAssistant } from '@/components/ai-chat';
import { syllabus } from '@/lib/data/syllabus-data';
import Link from 'next/link';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MockTestPage() {
  const syllabusRef = useRef<HTMLDivElement>(null);
  const syllabusContext = JSON.stringify(syllabus);

  const handleScrollToSyllabus = () => {
    syllabusRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 text-center bg-secondary/50">
            <div className="container">
                <h1 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold mb-4">VITEEE Mock Test</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Prepare for the VITEEE 2026 exam with our mock tests and resources.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/mocktest">
                            <Pencil className="mr-2 h-4 w-4" />
                            Take VITEEE Mock Test
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="outline">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Talk with AI
                            </Button>
                        </DialogTrigger>
                        <AIChatAssistant syllabusContext={syllabusContext} />
                    </Dialog>
                    <Button size="lg" variant="outline" onClick={handleScrollToSyllabus}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Syllabus
                    </Button>
                </div>
            </div>
        </section>
        <MockTestPattern />
        <div ref={syllabusRef}>
            <SyllabusSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
