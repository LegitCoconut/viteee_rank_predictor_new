'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  BookOpen,
  BarChart2,
  Eye,
  BookmarkCheck,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Calculator,
  MinusCircle,
} from 'lucide-react';

// VITEEE-style marking scheme applied on the results page.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

const subjectNames: Record<string, string> = {
  maths: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  apt_eng: 'Aptitude & English',
};

const subjectAccent: Record<string, string> = {
  maths: 'from-coral to-peach',
  physics: 'from-mint to-sky',
  chemistry: 'from-lavender to-coral',
  apt_eng: 'from-sky to-mint',
};

interface ResultData {
  userId: string;
  score: number;
  wrong?: number;
  marks?: number;
  maxMarks?: number;
  totalQuestions: number;
  answers?: Array<{ visited?: boolean; status?: string }>;
  sectionScores?: Record<
    string,
    { score: number; wrong?: number; total: number }
  >;
  mode?: 'random' | 'predefined';
  predefinedName?: string;
}

function grade(pct: number) {
  if (pct >= 85) return { label: 'Incredible', tone: 'Top-tier performance.' };
  if (pct >= 70) return { label: 'Strong', tone: 'Keep this momentum.' };
  if (pct >= 55) return { label: 'Solid base', tone: 'Fix the gaps and you\u2019re there.' };
  if (pct >= 40) return { label: 'Getting there', tone: 'One more pass through weak topics.' };
  return { label: 'Good start', tone: 'Every topper started somewhere.' };
}

export default function MockTestResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const resultData = sessionStorage.getItem('latestResult');
    if (!resultData) {
      router.replace('/mocktest');
    } else {
      setResult(JSON.parse(resultData));
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading results\u2026</p>
        </main>
        <Footer />
      </div>
    );
  }

  const attemptedCount =
    result.answers?.filter((a) => a.status === 'answered').length || 0;
  const visitedCount = result.answers?.filter((a) => a.visited).length || 0;
  const notVisitedCount = result.answers?.filter((a) => !a.visited).length || 0;
  const markedCount =
    result.answers?.filter((a) => a.status === 'marked').length || 0;

  // Backward-compat: older stored results don't carry marks/wrong fields.
  // Derive them: wrong = attempted - correct, marks = correct*4 - wrong*1.
  const wrongAnswers =
    typeof result.wrong === 'number'
      ? result.wrong
      : Math.max(attemptedCount - result.score, 0);
  const unansweredCount = Math.max(
    result.totalQuestions - result.score - wrongAnswers,
    0
  );
  const marks =
    typeof result.marks === 'number'
      ? result.marks
      : result.score * MARK_CORRECT + wrongAnswers * MARK_WRONG;
  const maxMarks =
    typeof result.maxMarks === 'number' && result.maxMarks > 0
      ? result.maxMarks
      : result.totalQuestions * MARK_CORRECT;

  const percentage = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
  const gradeInfo = grade(percentage);
  const title =
    result.mode === 'predefined' && result.predefinedName
      ? result.predefinedName
      : 'Random mock test';

  const tiles: Array<{
    icon: typeof CheckCircle2;
    value: number | string;
    sub?: string;
    label: string;
    color: string;
    ring: string;
    glow: string;
  }> = [
    {
      icon: CheckCircle2,
      value: result.score,
      sub: `+${result.score * MARK_CORRECT} marks`,
      label: 'Correct',
      color: 'text-mint',
      ring: 'ring-mint/30',
      glow: 'bg-mint/10',
    },
    {
      icon: XCircle,
      value: wrongAnswers,
      sub: `${wrongAnswers * MARK_WRONG} marks`,
      label: 'Wrong',
      color: 'text-coral',
      ring: 'ring-coral/30',
      glow: 'bg-coral/10',
    },
    {
      icon: MinusCircle,
      value: unansweredCount,
      sub: '0 marks',
      label: 'Unanswered',
      color: 'text-muted-foreground',
      ring: 'ring-border',
      glow: 'bg-muted/40',
    },
    {
      icon: Check,
      value: attemptedCount,
      label: 'Attempted',
      color: 'text-sky',
      ring: 'ring-sky/30',
      glow: 'bg-sky/10',
    },
    {
      icon: BookmarkCheck,
      value: markedCount,
      label: 'Marked',
      color: 'text-lavender',
      ring: 'ring-lavender/30',
      glow: 'bg-lavender/10',
    },
    {
      icon: Eye,
      value: visitedCount,
      sub: `${notVisitedCount} skipped`,
      label: 'Visited',
      color: 'text-peach',
      ring: 'ring-peach/30',
      glow: 'bg-peach/10',
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="relative isolate overflow-hidden hero-mesh py-20 md:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-1/4 h-[26rem] w-[26rem] rounded-full blur-3xl animate-blob-slow"
              style={{ background: 'radial-gradient(circle, hsl(var(--coral) / 0.5), transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full blur-3xl animate-blob"
              style={{ background: 'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)' }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
            >
              <Award className="h-3.5 w-3.5 text-coral" />
              Test complete · {title}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter text-white"
            >
              Well done,{' '}
              <span className="font-display italic gradient-text">
                {result.userId}
              </span>
              .
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-base text-white/70 md:text-lg"
            >
              Here\u2019s how your attempt broke down. Take a breath, then go
              fix what slipped.
            </motion.p>
          </div>
        </section>

        {/* Score orb + grade */}
        <section className="container mx-auto -mt-16 max-w-5xl px-4 md:-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="shimmer-border relative mx-auto max-w-3xl rounded-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.12]" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-coral/20 to-peach/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-br from-mint/20 to-sky/20 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
                <ScoreOrb marks={marks} maxMarks={maxMarks} percentage={percentage} />

                <div className="flex-1 text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                    {gradeInfo.label}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    You scored{' '}
                    <span className="font-display italic text-coral">
                      {marks}
                    </span>{' '}
                    out of{' '}
                    <span className="font-display italic">{maxMarks}</span>.
                  </h2>
                  <p className="mt-3 text-base text-muted-foreground">
                    {gradeInfo.tone}
                  </p>

                  <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground md:justify-start">
                    <Calculator className="h-3.5 w-3.5 text-coral" />
                    <span className="font-mono">+{MARK_CORRECT}</span> per
                    correct ·{' '}
                    <span className="font-mono">{MARK_WRONG}</span> per wrong ·{' '}
                    <span className="font-mono">0</span> unanswered
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                    <Button
                      asChild
                      className="shimmer-border group h-11 gap-2 rounded-full bg-gradient-to-r from-coral to-peach px-6 text-sm font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach"
                    >
                      <Link href="/mocktest/results/detailed">
                        Review every question
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 gap-2 rounded-full border-border/70"
                    >
                      <Link href="/mocktest">
                        <RotateCcw className="h-4 w-4" />
                        Take another
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Breakdown tiles */}
        <section className="container mx-auto mt-14 max-w-5xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
              <Sparkles className="h-5 w-5 text-coral" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                The breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                Six slices of the attempt.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {tiles.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md ring-1 ${t.ring}`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${t.glow} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="font-display text-5xl italic leading-none">
                      {t.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {t.label}
                    </p>
                    {t.sub && (
                      <p className={`mt-1 font-mono text-[11px] ${t.color}`}>
                        {t.sub}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-background shadow-sm ${t.color}`}
                  >
                    <t.icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section-wise performance */}
        {result.sectionScores && (
          <section className="container mx-auto mt-14 max-w-5xl px-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-sky/20">
                <BarChart2 className="h-5 w-5 text-mint" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Subject-wise performance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Where you shone, where you stumbled.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
              <div className="space-y-6">
                {Object.entries(result.sectionScores).map(
                  ([subject, scores], i) => {
                    if (!scores || scores.total <= 0) return null;
                    const sectionWrong =
                      typeof scores.wrong === 'number' ? scores.wrong : 0;
                    const sectionMarks =
                      scores.score * MARK_CORRECT + sectionWrong * MARK_WRONG;
                    const sectionMax = scores.total * MARK_CORRECT;
                    const pct =
                      sectionMax > 0 ? (sectionMarks / sectionMax) * 100 : 0;
                    const clampedPct = Math.max(0, Math.min(100, pct));
                    const gradient =
                      subjectAccent[subject] ?? 'from-coral to-peach';
                    return (
                      <motion.div
                        key={subject}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                      >
                        <div className="mb-2 flex items-baseline justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold tracking-tight">
                              {subjectNames[subject] || subject}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {scores.score} correct · {sectionWrong} wrong ·{' '}
                              {scores.total} total
                            </p>
                          </div>
                          <p className="text-right text-sm text-muted-foreground">
                            <span className="font-display text-lg italic text-foreground">
                              {sectionMarks}
                            </span>{' '}
                            / {sectionMax}
                            <span className="ml-2 text-xs uppercase tracking-widest">
                              {pct.toFixed(0)}%
                            </span>
                          </p>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${clampedPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.06, ease: 'easeOut' }}
                            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}`}
                          />
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer actions */}
        <section className="container mx-auto mt-14 max-w-5xl px-4 pb-20">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="h-11 gap-2 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
            >
              <Link href="/mocktest">
                <RotateCcw className="h-4 w-4" />
                Take another test
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 gap-2 rounded-full border-border/70"
            >
              <Link href="/mocktest/results/detailed">
                <BookOpen className="h-4 w-4" />
                Detailed review
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-11 gap-2 rounded-full"
            >
              <Link href="/mocktest#past-results">
                All past attempts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ScoreOrb({
  marks,
  maxMarks,
  percentage,
}: {
  marks: number;
  maxMarks: number;
  percentage: number;
}) {
  // The ring can only fill from 0→100. Clamp so negative totals (rare but
  // possible with heavy negative marking) don't produce NaN geometry.
  const clamped = Math.max(0, Math.min(100, percentage));
  const spring = useSpring(0, { stiffness: 40, damping: 18 });
  useEffect(() => {
    spring.set(clamped);
  }, [spring, clamped]);

  const pctDisplay = useTransform(spring, (v) => `${Math.round(v)}%`);

  const marksSpring = useSpring(0, { stiffness: 40, damping: 18 });
  useEffect(() => {
    marksSpring.set(marks);
  }, [marksSpring, marks]);
  const marksDisplay = useTransform(marksSpring, (v) => Math.round(v).toString());

  // SVG ring geometry
  const size = 220;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useTransform(spring, (v) => circumference * (1 - v / 100));

  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--coral))" />
            <stop offset="50%" stopColor="hsl(var(--peach))" />
            <stop offset="100%" stopColor="hsl(var(--mint))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          opacity={0.4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#orbGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="font-display text-6xl italic leading-none text-foreground">
          {marksDisplay}
        </motion.span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          of {maxMarks} marks
        </span>
        <motion.span className="mt-3 rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-foreground">
          {pctDisplay}
        </motion.span>
      </div>
    </div>
  );
}
