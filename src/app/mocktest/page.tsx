'use client';

import { useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MockTestPattern } from '@/components/mock-test-pattern';
import { Button } from '@/components/ui/button';
import { BookOpen, Pencil, ArrowDown, FileText, Clock, HelpCircle, Zap } from 'lucide-react';
import { SyllabusSection } from '@/components/syllabus-section';
import { SyllabusDownloads } from '@/components/syllabus-downloads';
import { MockTestJsonLd } from '@/components/json-ld';

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
      <MockTestJsonLd />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-dvh flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <Zap className="h-4 w-4" />
              Free &middot; No Signup &middot; Instant Results
            </div>

            <h1 className="text-5xl md:text-7xl font-headline tracking-tighter font-semibold mb-6 max-w-4xl mx-auto">
              VITEEE
              <span className="text-primary"> Mock Test</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice with real exam pattern questions. Get instant section-wise analysis and improve your score.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {[
                { icon: HelpCircle, label: '125 Questions', sublabel: 'Real pattern' },
                { icon: Clock, label: '2.5 Hours', sublabel: 'Timed exam' },
                { icon: Zap, label: 'Instant', sublabel: 'Results & analysis' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/20" asChild>
                <Link href="/mocktest/setup">
                  <Pencil className="h-4 w-4" />
                  Start Mock Test
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base" onClick={handleScrollToPattern}>
                <FileText className="h-4 w-4" />
                View Exam Pattern
              </Button>
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base" onClick={handleScrollToSyllabus}>
                <BookOpen className="h-4 w-4" />
                View Syllabus
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleScrollToContent}>
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
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
