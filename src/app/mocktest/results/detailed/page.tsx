'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronLeft,
  Search,
  RotateCcw,
  FileWarning,
} from 'lucide-react';
import type { Answer, QuestionSnapshot, QuestionWithImage } from '@/lib/types';
import { AdSlot } from '@/components/ad-slot';

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

// VITEEE-style marking - mirror of results/page.tsx so the chip stays honest.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; result: StoredResult; questions: QuestionWithImage[]; source: 'session' | 'local' }
  | { status: 'missing-snapshot' }
  | { status: 'not-found' };

export default function DetailedResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Loading detailed results&hellip;</p>
          </main>
          <Footer />
        </div>
      }
    >
      <DetailedResultsPage />
    </Suspense>
  );
}

function DetailedResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examIdParam = searchParams.get('examId');
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    // Two data sources:
    //   1. With ?examId=<id> → past attempt: read from localStorage (results
    //      list + per-attempt question snapshot).
    //   2. Without examId → fresh post-submit redirect: read the in-flight
    //      copy from sessionStorage so nothing changes for the immediate flow.
    try {
      if (examIdParam) {
        const rawResults = localStorage.getItem('mockTestResults');
        const rawMap = localStorage.getItem('mockTestQuestions');
        const results: StoredResult[] = rawResults ? JSON.parse(rawResults) : [];
        const snapMap: Record<string, QuestionSnapshot[]> = rawMap
          ? JSON.parse(rawMap)
          : {};
        const result = results.find((r) => r.examId === examIdParam);
        if (!result) {
          setLoad({ status: 'not-found' });
          return;
        }
        const snapshot = snapMap[examIdParam];
        if (!snapshot || snapshot.length === 0) {
          setLoad({ status: 'missing-snapshot' });
          return;
        }
        const questions: QuestionWithImage[] = snapshot.map((s) => ({
          _id: s._id,
          imageUrl: s.imageUrl,
          correct_option: s.correct_option,
          subject: s.subject,
          image_id: s._id,
        }));
        setLoad({ status: 'ready', result, questions, source: 'local' });
        return;
      }

      const rawResult = sessionStorage.getItem('latestResult');
      const rawQuestions = sessionStorage.getItem('latestQuestions');
      if (!rawResult || !rawQuestions) {
        router.replace('/mocktest');
        return;
      }
      setLoad({
        status: 'ready',
        result: JSON.parse(rawResult),
        questions: JSON.parse(rawQuestions),
        source: 'session',
      });
    } catch {
      router.replace('/mocktest');
    }
  }, [router, examIdParam]);

  const questions = load.status === 'ready' ? load.questions : null;
  const result = load.status === 'ready' ? load.result : null;

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

  if (load.status === 'loading') {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading detailed results&hellip;</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (load.status === 'not-found' || load.status === 'missing-snapshot') {
    const isLegacy = load.status === 'missing-snapshot';
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <Header />
        <main className="flex-1">
          <section className="container mx-auto max-w-2xl px-4 py-24 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileWarning className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
              {isLegacy
                ? 'Detailed review isn\u2019t available for this attempt.'
                : 'We couldn\u2019t find that attempt.'}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              {isLegacy
                ? 'This test was taken before we started caching question-by-question data in your browser. Future attempts will open fully in this view.'
                : 'The attempt may have been deleted, or the link is out of date. Head back to your history and pick another.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="h-11 gap-2 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
              >
                <Link href="/mocktest">
                  <RotateCcw className="h-4 w-4" />
                  Take a new test
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 gap-2 rounded-full border-border/70"
              >
                <Link href="/mocktest#past-results">
                  <ChevronLeft className="h-4 w-4" />
                  Back to history
                </Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!questions || !result) {
    // Belt-and-braces: load.status === 'ready' guarantees these, but TS
    // narrowing won't always carry that through the derived locals above.
    return null;
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
        <section className="hero-mesh py-10 md:py-14">
          <div className="container mx-auto max-w-7xl px-4">
            <Button variant="ghost" size="sm" asChild className="-ml-3 mb-3 gap-1 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <Link href={load.source === 'local' ? '/mocktest#past-results' : '/mocktest/results'}>
                <ChevronLeft className="h-4 w-4" />
                {load.source === 'local' ? 'Back to history' : 'Back to summary'}
              </Link>
            </Button>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                  Every <span className="gradient-text">question</span>, reviewed.
                </h1>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                  Walk through your attempt once more. Filter what you need and look for patterns.
                </p>
              </div>

              <dl className="grid shrink-0 grid-cols-3 divide-x divide-border self-start rounded-2xl border border-border bg-card md:self-auto">
                <div className="px-4 py-3">
                  <dd className="text-2xl font-semibold tabular-nums">
                    {marks}
                    <span className="text-base text-muted-foreground">/{maxMarks}</span>
                  </dd>
                  <dt className="text-xs text-muted-foreground">Marks</dt>
                </div>
                <div className="px-4 py-3">
                  <dd className="text-2xl font-semibold tabular-nums">{result.score}</dd>
                  <dt className="text-xs text-muted-foreground">Correct</dt>
                </div>
                <div className="px-4 py-3">
                  <dd className="text-2xl font-semibold tabular-nums">{pct.toFixed(0)}%</dd>
                  <dt className="text-xs text-muted-foreground">Score</dt>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className="glass sticky top-14 z-30 border-x-0 border-t-0">
          <div className="container mx-auto max-w-7xl px-4">
            <div role="group" aria-label="Filter questions" className="flex flex-wrap items-center gap-2 py-3">
              {(['all', 'correct', 'incorrect', 'unanswered'] as FilterKey[]).map((key) => {
                const isActive = filter === key;
                return (
                  <button
                    key={key}
                    aria-pressed={isActive}
                    onClick={() => setFilter(key)}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium capitalize transition-colors ${
                      isActive
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {key}
                    <span className="text-xs tabular-nums opacity-70">{counts[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question review grid */}
        <div className="container mx-auto max-w-7xl px-4 py-10 pb-20">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.flatMap((row, i) => {
                const card = (
                  <QuestionReviewCard key={row.question._id} row={row} />
                );
                const isAdBoundary = (i + 1) % 6 === 0 && i + 1 < filtered.length;
                if (!isAdBoundary) return [card];
                return [
                  card,
                  <div key={`ad-${i}`} className="col-span-full">
                    <AdSlot slot="1678847129" />
                  </div>,
                ];
              })}
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
}: {
  row: {
    index: number;
    question: QuestionWithImage;
    chosen: string | null;
    verdict: 'correct' | 'incorrect' | 'unanswered';
  };
}) {
  const { index, question, chosen, verdict } = row;

  // Colour plus icon and label: status never relies on colour alone.
  const style = {
    correct: { Icon: CheckCircle2, label: 'Correct', accent: 'text-mint' },
    incorrect: { Icon: XCircle, label: 'Incorrect', accent: 'text-coral' },
    unanswered: { Icon: MinusCircle, label: 'Not answered', accent: 'text-muted-foreground' },
  }[verdict];

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5">
      <header className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm">
          <span className="font-semibold tabular-nums">Q{index + 1}</span>
          <span className="text-muted-foreground"> &middot; {subjectNames[question.subject] || question.subject}</span>
        </p>
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.accent}`}>
          <style.Icon className="h-4 w-4" aria-hidden="true" />
          {style.label}
        </span>
      </header>

      {question.imageUrl ? (
        <div className="relative w-full overflow-hidden rounded-xl bg-white">
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
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Image unavailable
        </div>
      )}

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-secondary px-4 py-2.5">
          <dt className="text-xs text-muted-foreground">Your answer</dt>
          <dd className={`mt-0.5 text-lg font-semibold uppercase ${chosen === null ? 'text-muted-foreground' : style.accent}`}>
            {chosen ?? '-'}
          </dd>
        </div>
        <div className="rounded-xl bg-secondary px-4 py-2.5">
          <dt className="text-xs text-muted-foreground">Correct answer</dt>
          <dd className="mt-0.5 text-lg font-semibold uppercase text-mint">{question.correct_option}</dd>
        </div>
      </dl>
    </article>
  );
}
