'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DonationPopup } from '@/components/donation-popup';
import { AdSlot } from '@/components/ad-slot';
import { ArrowRight } from 'lucide-react';

// VITEEE-style marking scheme applied on the results page.
const MARK_CORRECT = 4;
const MARK_WRONG = -1;

const subjectNames: Record<string, string> = {
  maths: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  apt_eng: 'Aptitude & English',
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
          <p className="text-muted-foreground">Loading results&hellip;</p>
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

  const tiles: Array<{ value: number | string; sub?: string; label: string; tone: string }> = [
    { value: result.score, sub: `+${result.score * MARK_CORRECT} marks`, label: 'Correct', tone: 'text-mint' },
    { value: wrongAnswers, sub: `${wrongAnswers * MARK_WRONG} marks`, label: 'Wrong', tone: 'text-coral' },
    { value: unansweredCount, sub: '0 marks', label: 'Unanswered', tone: 'text-muted-foreground' },
    { value: attemptedCount, label: 'Attempted', tone: 'text-muted-foreground' },
    { value: markedCount, label: 'Marked for review', tone: 'text-muted-foreground' },
    { value: visitedCount, sub: `${notVisitedCount} skipped`, label: 'Visited', tone: 'text-muted-foreground' },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DonationPopup delay={500} />
      <Header />
      <main className="flex-1">
        <section className="hero-mesh py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <p className="text-sm text-muted-foreground">Test complete &middot; {title}</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Well done, <span className="gradient-text">{result.userId}</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
              Here&rsquo;s how your attempt broke down. Take a breath, then go fix what slipped.
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-3xl px-4">
          <div className="flex flex-col items-center gap-8 rounded-2xl border border-border bg-card p-6 md:flex-row md:gap-10 md:p-8">
            <ScoreRing marks={marks} maxMarks={maxMarks} percentage={percentage} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-medium text-coral">{gradeInfo.label}</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                You scored <span className="text-coral">{marks}</span> out of {maxMarks}.
              </h2>
              <p className="mt-2 text-muted-foreground">{gradeInfo.tone}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Marking: +{MARK_CORRECT} per correct, {MARK_WRONG} per wrong, 0 if unanswered.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                <Button asChild>
                  <Link href="/mocktest/results/detailed">
                    Review every question
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/mocktest">Take another</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-12 max-w-3xl px-4">
          <h3 className="text-xl font-semibold tracking-tight">The breakdown</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-3xl font-semibold tabular-nums tracking-tight">{t.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.label}</p>
                {t.sub && <p className={`mt-0.5 text-xs tabular-nums ${t.tone}`}>{t.sub}</p>}
              </div>
            ))}
          </div>
        </section>

        <AdSlot />

        {result.sectionScores && (
          <section className="container mx-auto mt-12 max-w-3xl px-4">
            <h3 className="text-xl font-semibold tracking-tight">Subject-wise performance</h3>
            <div className="mt-4 space-y-5 rounded-2xl border border-border bg-card p-5 md:p-6">
              {Object.entries(result.sectionScores).map(([subject, scores]) => {
                if (!scores || scores.total <= 0) return null;
                const sectionWrong = typeof scores.wrong === 'number' ? scores.wrong : 0;
                const sectionMarks = scores.score * MARK_CORRECT + sectionWrong * MARK_WRONG;
                const sectionMax = scores.total * MARK_CORRECT;
                const pct = sectionMax > 0 ? (sectionMarks / sectionMax) * 100 : 0;
                const clampedPct = Math.max(0, Math.min(100, pct));
                return (
                  <div key={subject}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{subjectNames[subject] || subject}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {scores.score} correct &middot; {sectionWrong} wrong &middot; {scores.total} total
                        </p>
                      </div>
                      <p className="text-sm tabular-nums text-muted-foreground">
                        <span className="font-semibold text-foreground">{sectionMarks}</span> / {sectionMax}
                        <span className="ml-2 text-xs">{pct.toFixed(0)}%</span>
                      </p>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-secondary"
                      role="progressbar"
                      aria-valuenow={Math.round(clampedPct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${subjectNames[subject] || subject} score`}
                    >
                      <div className="h-full rounded-full bg-primary" style={{ width: `${clampedPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="container mx-auto mt-12 max-w-3xl px-4">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Keep VIT RANKS free for the next student.</h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                No ads, no paywall, no signup, and we want to keep it that way. If this attempt helped,
                the price of a cup of chai goes a long way on a student budget.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/donate">Support us</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto mt-10 max-w-3xl px-4 pb-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/mocktest">Take another test</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/mocktest/results/detailed">Detailed review</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/mocktest#past-results">All past attempts</Link>
            </Button>
          </div>
        </section>

        <AdSlot />
      </main>
      <Footer />
    </div>
  );
}

function ScoreRing({ marks, maxMarks, percentage }: { marks: number; maxMarks: number; percentage: number }) {
  // Clamp so negative totals (heavy negative marking) don't produce NaN geometry.
  const clamped = Math.max(0, Math.min(100, percentage));
  const size = 168;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${marks} out of ${maxMarks} marks, ${Math.round(percentage)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tabular-nums leading-none">{marks}</span>
        <span className="mt-1 text-xs text-muted-foreground">of {maxMarks}</span>
        <span className="mt-2 text-sm font-medium text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
