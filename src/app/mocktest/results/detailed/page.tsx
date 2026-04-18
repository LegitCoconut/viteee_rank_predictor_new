'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronLeft,
  Filter,
  Search,
} from 'lucide-react';
import type { Answer, QuestionWithImage } from '@/lib/types';

const subjectNames: Record<string, string> = {
  maths: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  apt_eng: 'Aptitude & English',
};

type FilterKey = 'all' | 'correct' | 'incorrect' | 'unanswered';

interface StoredResult {
  examId: string;
  score: number;
  wrong?: number;
  marks?: number;
  maxMarks?: number;
  totalQuestions: number;
  answers: Answer[];
  mode?: 'random' | 'predefined';
  predefinedName?: string;
}

// VITEEE-style marking — mirror of results/page.tsx so the chip stays honest.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

export default function DetailedResultsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionWithImage[] | null>(null);
  const [result, setResult] = useState<StoredResult | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    try {
      const rawResult = sessionStorage.getItem('latestResult');
      const rawQuestions = sessionStorage.getItem('latestQuestions');
      if (!rawResult || !rawQuestions) {
        router.replace('/mocktest');
        return;
      }
      setResult(JSON.parse(rawResult));
      setQuestions(JSON.parse(rawQuestions));
    } catch {
      router.replace('/mocktest');
    }
  }, [router]);

  const rows = useMemo(() => {
    if (!questions || !result) return [];
    const answerByQid = new Map(
      result.answers.map((a) => [a.questionId, a])
    );
    return questions.map((q, index) => {
      const ans = answerByQid.get(q._id);
      const chosen = ans?.answer ?? null;
      const verdict: 'correct' | 'incorrect' | 'unanswered' =
        chosen === null
          ? 'unanswered'
          : chosen === q.correct_option
          ? 'correct'
          : 'incorrect';
      return { index, question: q, chosen, verdict };
    });
  }, [questions, result]);

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter((r) => r.verdict === filter)),
    [rows, filter]
  );

  const counts = useMemo(
    () => ({
      all: rows.length,
      correct: rows.filter((r) => r.verdict === 'correct').length,
      incorrect: rows.filter((r) => r.verdict === 'incorrect').length,
      unanswered: rows.filter((r) => r.verdict === 'unanswered').length,
    }),
    [rows]
  );

  if (!questions || !result) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading detailed results\u2026</p>
        </main>
        <Footer />
      </div>
    );
  }

  const title =
    result.mode === 'predefined' && result.predefinedName
      ? result.predefinedName
      : 'Random mock test';

  const attemptedCount = result.answers.filter((a) => a.answer !== null).length;
  const wrongAnswers =
    typeof result.wrong === 'number'
      ? result.wrong
      : Math.max(attemptedCount - result.score, 0);
  const marks =
    typeof result.marks === 'number'
      ? result.marks
      : result.score * MARK_CORRECT + wrongAnswers * MARK_WRONG;
  const maxMarks =
    typeof result.maxMarks === 'number' && result.maxMarks > 0
      ? result.maxMarks
      : result.totalQuestions * MARK_CORRECT;
  const pct = maxMarks ? (marks / maxMarks) * 100 : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Slim premium banner */}
        <section className="relative isolate overflow-hidden hero-mesh py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-20 left-1/3 h-[22rem] w-[22rem] rounded-full blur-3xl animate-blob-slow"
              style={{ background: 'radial-gradient(circle, hsl(var(--coral) / 0.4), transparent 60%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 h-[20rem] w-[20rem] rounded-full blur-3xl animate-blob"
              style={{ background: 'radial-gradient(circle, hsl(var(--lavender) / 0.35), transparent 60%)' }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="container relative z-10 mx-auto max-w-7xl px-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 -ml-2 gap-1 text-white/75 hover:bg-white/10 hover:text-white"
            >
              <Link href="/mocktest/results">
                <ChevronLeft className="h-4 w-4" /> Back to summary
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                  {title}
                </p>
                <h1 className="mt-2 text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[0.95] tracking-tighter text-white">
                  Every{' '}
                  <span className="font-display italic gradient-text">
                    question
                  </span>
                  , reviewed.
                </h1>
                <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                  Walk through your attempt one more time. Filter what you need.
                  Notice the patterns.
                </p>
              </div>

              <div className="glass inline-flex items-center gap-4 self-start rounded-2xl px-5 py-3 text-left md:self-auto">
                <div>
                  <p className="font-display text-3xl italic leading-none text-white">
                    {marks}
                    <span className="text-coral">/{maxMarks}</span>
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/60">
                    {result.score}C · {wrongAnswers}W · {pct.toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sticky filter bar */}
        <div className="sticky top-14 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center gap-2 py-3">
              <div className="mr-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </div>
              {(['all', 'correct', 'incorrect', 'unanswered'] as FilterKey[]).map(
                (key) => {
                  const isActive = filter === key;
                  const toneClasses =
                    key === 'correct'
                      ? 'data-[active=true]:bg-mint/15 data-[active=true]:text-mint data-[active=true]:border-mint/40'
                      : key === 'incorrect'
                      ? 'data-[active=true]:bg-coral/15 data-[active=true]:text-coral data-[active=true]:border-coral/40'
                      : key === 'unanswered'
                      ? 'data-[active=true]:bg-muted data-[active=true]:text-foreground data-[active=true]:border-border'
                      : 'data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-foreground';
                  return (
                    <button
                      key={key}
                      data-active={isActive}
                      onClick={() => setFilter(key)}
                      className={`inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card px-3.5 text-xs font-semibold tracking-tight capitalize transition-all hover:-translate-y-0.5 ${toneClasses}`}
                    >
                      {key}
                      <span className="text-[10px] opacity-70">({counts[key]})</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Question review grid */}
        <div className="container mx-auto max-w-7xl px-4 py-10 pb-20">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((row, i) => (
                <QuestionReviewCard key={row.question._id} row={row} order={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No questions match this filter.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function QuestionReviewCard({
  row,
  order,
}: {
  row: {
    index: number;
    question: QuestionWithImage;
    chosen: string | null;
    verdict: 'correct' | 'incorrect' | 'unanswered';
  };
  order: number;
}) {
  const { index, question, chosen, verdict } = row;

  const style = {
    correct: {
      Icon: CheckCircle2,
      label: 'Correct',
      ring: 'ring-mint/30',
      accent: 'text-mint',
      badge: 'bg-mint/10 text-mint border-mint/30',
      bar: 'bg-mint',
    },
    incorrect: {
      Icon: XCircle,
      label: 'Incorrect',
      ring: 'ring-coral/30',
      accent: 'text-coral',
      badge: 'bg-coral/10 text-coral border-coral/30',
      bar: 'bg-coral',
    },
    unanswered: {
      Icon: MinusCircle,
      label: 'Not answered',
      ring: 'ring-border',
      accent: 'text-muted-foreground',
      badge: 'bg-muted text-muted-foreground border-border',
      bar: 'bg-border',
    },
  }[verdict];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(order * 0.025, 0.25) }}
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ${style.ring} transition-shadow hover:shadow-md`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} />

      <div className="p-5 md:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-mono text-xs font-semibold">
              {index + 1}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {subjectNames[question.subject] || question.subject}
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
          >
            <style.Icon className="h-3.5 w-3.5" />
            {style.label}
          </span>
        </header>

        {question.imageUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl border bg-white">
            <Image
              src={question.imageUrl}
              alt={`Question ${index + 1}`}
              width={800}
              height={400}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-xs italic text-muted-foreground">
            (image unavailable)
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Your answer
            </p>
            <p
              className={`mt-1 font-mono text-lg font-semibold uppercase ${
                chosen === null ? 'text-muted-foreground' : style.accent
              }`}
            >
              {chosen ?? '—'}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Correct answer
            </p>
            <p className="mt-1 font-mono text-lg font-semibold uppercase text-mint">
              {question.correct_option}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
