'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MockTestPattern } from '@/components/mock-test-pattern';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Pencil,
  FileText,
  Clock,
  HelpCircle,
  Zap,
  Shuffle,
  ListChecks,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { PredefinedMockTestSummary } from '@/lib/types';
import { SyllabusSection } from '@/components/syllabus-section';
import { SyllabusDownloads } from '@/components/syllabus-downloads';
import { MockTestJsonLd } from '@/components/json-ld';

import Link from 'next/link';
import { PastResults } from '@/components/past-results';
import { Leaderboard } from '@/components/leaderboard';
import { AdSlot } from '@/components/ad-slot';
import { DonationPopup } from '@/components/donation-popup';

export default function MockTestPage() {
  const syllabusRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const opacityContent = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0]);

  const [predefined, setPredefined] = useState<PredefinedMockTestSummary[] | null>(null);
  const [mobileTab, setMobileTab] = useState<'random' | 'predefined'>('random');
  const [takenPredefinedIds, setTakenPredefinedIds] = useState<Set<number>>(new Set());
  const [leaderboardData, setLeaderboardData] = useState<{ random: any[]; predefined: any[] } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/mocktest/predefined');
        if (!res.ok) throw new Error('failed');
        const list: PredefinedMockTestSummary[] = await res.json();
        setPredefined(list);
      } catch {
        setPredefined([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/mocktest/leaderboard?split=true');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setLeaderboardData(data);
      } catch {
        setLeaderboardData({ random: [], predefined: [] });
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mockTestResults');
      if (!raw) return;
      const results: Array<{ mode?: string; predefinedId?: number }> = JSON.parse(raw);
      const taken = new Set<number>();
      for (const r of results) {
        if (r.mode === 'predefined' && typeof r.predefinedId === 'number') {
          taken.add(r.predefinedId);
        }
      }
      setTakenPredefinedIds(taken);
    } catch {
      // ignore malformed local storage
    }
  }, []);

  const predefinedById = (id: number) => predefined?.find(s => s.id === id);

  const handleScrollToSyllabus = () => {
    syllabusRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToPattern = () => {
    patternRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <MockTestJsonLd />
      <DonationPopup />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative isolate flex min-h-[90svh] flex-col items-center justify-center overflow-hidden hero-mesh text-center"
        >
          {/* Parallax blobs */}
          <motion.div style={{ y: yBg }} className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full blur-3xl animate-blob-slow"
              style={{ background: 'radial-gradient(circle, hsl(var(--coral) / 0.55), transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 -right-32 h-[30rem] w-[30rem] rounded-full blur-3xl animate-blob"
              style={{ background: 'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)' }}
            />
            <div
              className="absolute top-1/2 left-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl animate-blob-fast"
              style={{ background: 'radial-gradient(circle, hsl(var(--lavender) / 0.4), transparent 60%)' }}
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <motion.div
            style={{ y: yContent, opacity: opacityContent }}
            className="container relative z-10 mx-auto px-4 py-24 pb-32 md:py-0 md:pb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
              </span>
              Free · No signup · Instant results
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mx-auto max-w-5xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter text-white"
            >
              The VITEEE{' '}
              <span className="font-display italic gradient-text whitespace-nowrap">mock tests</span>
              <br />
              you actually want to take.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/70 md:text-xl"
            >
              Real exam pattern. Real timer. Instant section-wise analytics.
              Pull a curated paper or spin up a randomised one — your call.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
            >
              {[
                { icon: HelpCircle, value: '100', label: 'Questions' },
                { icon: Clock, value: '2h', label: 'Timer' },
                { icon: Zap, value: '10k+', label: 'Mocks taken' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-center sm:flex-row sm:gap-3 sm:px-5 sm:text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-coral/30 to-peach/30 sm:h-10 sm:w-10">
                    <s.icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl italic leading-none text-white sm:text-2xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-white/60 sm:text-[11px]">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mx-auto mt-10 flex max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center"
            >
              <Button
                size="lg"
                asChild
                className="shimmer-border group h-12 gap-2 rounded-full bg-white px-7 text-base font-semibold text-plum-deep hover:bg-white/90"
              >
                <Link href="/mocktest/setup?mode=random">
                  <Shuffle className="h-4 w-4" />
                  Random mock test
                  <Sparkles className="ml-1 h-4 w-4 transition-transform group-hover:rotate-12" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full border-white/20 bg-white/5 px-6 text-base font-medium text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
                onClick={handleScrollToPattern}
              >
                <FileText className="h-4 w-4" />
                Exam pattern
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full border-white/20 bg-white/5 px-6 text-base font-medium text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
                onClick={handleScrollToSyllabus}
              >
                <BookOpen className="h-4 w-4" />
                Syllabus
              </Button>
            </motion.div>

            {/* Curated mock tests grid */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mt-12 max-w-3xl"
            >
              <div className="mb-4 flex items-center justify-center gap-2 text-xs text-white/60 sm:text-sm">
                <ListChecks className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Or pick a curated mock test</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {predefined === null
                  ? [1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-16 w-36 sm:w-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                        aria-hidden
                      />
                    ))
                  : [1, 2, 3, 4, 5].map((id) => {
                      const slot = predefinedById(id);
                      if (!slot?.active) return null;
                      const label = slot?.name ?? `Mock Test ${id}`;
                      const hasTaken = takenPredefinedIds.has(id);
                      const Icon = hasTaken ? RotateCcw : Pencil;
                      return (
                        <Link
                          key={id}
                          href={`/mocktest/setup?mode=predefined&id=${id}`}
                          className="h-16 w-36 sm:w-40 rounded-2xl border border-white/15 bg-white/10 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:bg-white/20"
                          title={hasTaken ? 'Retake this test' : undefined}
                        >
                          <Icon className="h-3.5 w-3.5 text-coral" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
              </div>
            </motion.div>
          </motion.div>

          {/* Fade into next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </section>

        {/* Ad #1: after hero */}
        <AdSlot />

        <div ref={contentRef}>
          <PastResults />

          {/* Ad #2: after history */}
          <AdSlot />

          {/* Split leaderboard */}
          <section id="leaderboard" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Trophy className="h-3.5 w-3.5" />
                  Leaderboard
                </div>
                <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Top Scorers</h2>
                <p className="text-sm md:text-lg text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto px-2">
                  Beat the best. Your name could be here.
                </p>
              </div>
              {/* Mobile tab switcher */}
              <div className="flex md:hidden mb-5 w-fit mx-auto rounded-full border border-border bg-muted/50 p-1">
                <button
                  onClick={() => setMobileTab('random')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    mobileTab === 'random'
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Random Tests
                </button>
                <button
                  onClick={() => setMobileTab('predefined')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    mobileTab === 'predefined'
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mock Tests
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className={mobileTab === 'random' ? 'block' : 'hidden md:block'}>
                  <Leaderboard mode="random" initialData={leaderboardData?.random} />
                </div>
                <div className={mobileTab === 'predefined' ? 'block' : 'hidden md:block'}>
                  <Leaderboard mode="predefined" initialData={leaderboardData?.predefined} />
                </div>
              </div>
            </div>
          </section>

          {/* Ad #3: after leaderboard */}
          <AdSlot />

          <div ref={patternRef}>
            <MockTestPattern />
          </div>
        </div>
        <div ref={syllabusRef}>
          <SyllabusSection />

          {/* Ad #4: after syllabus */}
          <AdSlot />

          <SyllabusDownloads />

          {/* Ad #5: after syllabus download */}
          <AdSlot />
        </div>
      </main>
      <Footer />
    </div>
  );
}
