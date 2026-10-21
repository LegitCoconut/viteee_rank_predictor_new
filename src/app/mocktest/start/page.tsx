'use client';

import { SECTIONS, TOTAL_QUESTIONS } from '@/lib/exam-pattern';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, Loader2, Monitor } from 'lucide-react';
import { MockTestUI } from '@/components/mock-test-ui';
import { MockTestUIViteee } from '@/components/mock-test-ui-viteee';
import type { QuestionWithImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ad-slot';

const LG_BREAKPOINT_PX = 1024;
type ExamInterface = 'modern' | 'viteee';

export default function MockTestStartPage() {
  const router = useRouter();
  const [setupData, setSetupData] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionWithImage[]>([]);
  const [loadingState, setLoadingState] = useState<'fetching' | 'preloading' | 'ready' | 'error'>('fetching');
  const [error, setError] = useState<string | null>(null);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [viewportAllowsViteee, setViewportAllowsViteee] = useState(true);
  const [examInterface, setExamInterface] = useState<ExamInterface>('modern');

  useEffect(() => {
    const check = () => setViewportAllowsViteee(window.innerWidth >= LG_BREAKPOINT_PX);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mockTestExamInterface');
      if (stored === 'viteee' || stored === 'modern') {
        setExamInterface(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (!viewportAllowsViteee && examInterface === 'viteee') {
      setExamInterface('modern');
    }
  }, [viewportAllowsViteee, examInterface]);

  useEffect(() => {
    const data = sessionStorage.getItem('mockTestSetup');
    if (!data) {
      router.replace('/mocktest/setup');
      return;
    }
    setSetupData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    if (!setupData) return;

    async function fetchAndPreload() {
      try {
        setLoadingState('fetching');
        const endpoint =
          setupData.mode === 'predefined' && setupData.predefinedId
            ? `/api/mocktest/predefined/${setupData.predefinedId}/questions`
            : '/api/mocktest/questions';
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch questions. Please try again.');
        }
        let data: QuestionWithImage[] = await response.json();

        if (setupData.mode === 'predefined') {
          data = shuffleWithinSubjects(data);
        }

        if (data.length < TOTAL_QUESTIONS) {
          throw new Error(`Failed to load all questions. Only got ${data.length}/${TOTAL_QUESTIONS}.`);
        }

        setLoadingState('preloading');

        let loadedCount = 0;
        const concurrencyLimit = 10;
        let currentIndex = 0;

        while (currentIndex < data.length) {
          const batch = data.slice(currentIndex, currentIndex + concurrencyLimit);

          await Promise.all(batch.map((question) =>
            new Promise<void>((resolve) => {
              if (!question.imageUrl) {
                loadedCount++;
                setPreloadProgress((loadedCount / data.length) * 100);
                resolve();
                return;
              }
              const img = new Image();
              const done = () => {
                loadedCount++;
                setPreloadProgress((loadedCount / data.length) * 100);
                resolve();
              };
              img.onload = done;
              img.onerror = () => {
                console.error(`Failed to preload image for question ${question._id}`);
                done();
              };
              img.src = question.imageUrl;
            })
          ));

          currentIndex += concurrencyLimit;
        }

        setQuestions(data);
        setLoadingState('ready');
      } catch (err: any) {
        setError(err.message);
        setLoadingState('error');
      }
    }

    fetchAndPreload();
  }, [setupData]);

  if (!setupData) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isTestStarted) {
    const wantsViteee = examInterface === 'viteee' && viewportAllowsViteee;
    return wantsViteee
      ? <MockTestUIViteee questions={questions} setupData={setupData} />
      : <MockTestUI questions={questions} setupData={setupData} />;
  }

  const pickUI = (choice: ExamInterface) => {
    if (choice === 'viteee' && !viewportAllowsViteee) return;
    setExamInterface(choice);
    try {
      localStorage.setItem('mockTestExamInterface', choice);
    } catch {
      // ignore
    }
  };

  const startTest = () => {
    try {
      localStorage.setItem('mockTestExamInterface', examInterface);
    } catch {
      // ignore
    }
    setIsTestStarted(true);
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto py-8 text-center">
        {loadingState === 'fetching' && (
          <LoadingPanel title="Generating your mock test" detail="Picking questions for the 2027 pattern." progress={null} />
        )}
        {loadingState === 'preloading' && (
          <LoadingPanel title="Loading your test" detail="Fetching question images so nothing lags mid-test." progress={preloadProgress} />
        )}
        {loadingState === 'ready' && (
          <div className="flex w-full max-w-5xl flex-col items-center gap-6">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <div className="text-center">
              <h1 className="text-3xl font-headline font-semibold">Your test is ready.</h1>
              <p className="mt-2 text-muted-foreground">
                Pick the interface you want for this test. You can change your
                mind any time - your last choice is remembered.
              </p>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <UIPreviewCard
                title="Modern"
                subtitle="Clean, dark UI designed for this site. Works on any device."
                imageSrc={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/ui-vitranks.webp`}
                selected={examInterface === 'modern'}
                onClick={() => pickUI('modern')}
              />
              <UIPreviewCard
                title="VITEEE-style"
                subtitle="Mirrors the official VITEEE CBT interface - sections, palette, Mark-for-Review."
                imageSrc={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/vit-ui.webp`}
                selected={examInterface === 'viteee'}
                onClick={() => pickUI('viteee')}
                disabled={!viewportAllowsViteee}
                disabledHint="Available on laptop / tablet only"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button size="lg" onClick={startTest}>
                Start Test
              </Button>
              <p className="text-xs text-muted-foreground">
                The test will start in fullscreen mode.
              </p>
            </div>
          </div>
        )}
        {loadingState === 'error' && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">
            <h1 className="text-xl font-bold">Error</h1>
            <p>{error}</p>
          </div>
        )}
      </main>
      {/* Ad #7: above footer on loading/start page */}
      <AdSlot />
      <Footer />
    </div>
  );
}

const SUBJECT_ORDER = ['maths', 'physics', 'chemistry', 'apt_eng'];

function shuffleWithinSubjects(questions: QuestionWithImage[]): QuestionWithImage[] {
  const groups = new Map<string, QuestionWithImage[]>();
  for (const q of questions) {
    const g = groups.get(q.subject) ?? [];
    g.push(q);
    groups.set(q.subject, g);
  }
  for (const qs of groups.values()) {
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
  }
  const ordered: QuestionWithImage[] = [];
  for (const s of SUBJECT_ORDER) {
    if (groups.has(s)) ordered.push(...groups.get(s)!);
  }
  for (const [subj, qs] of groups) {
    if (!SUBJECT_ORDER.includes(subj)) ordered.push(...qs);
  }
  return ordered;
}

function UIPreviewCard({
  title,
  subtitle,
  imageSrc,
  selected,
  disabled,
  disabledHint,
  onClick,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
  selected: boolean;
  disabled?: boolean;
  disabledHint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-3 text-left transition-all ${
        disabled
          ? 'cursor-not-allowed border-dashed border-border/50 opacity-60'
          : selected
          ? 'border-coral shadow-lg shadow-coral/10 ring-1 ring-coral'
          : 'border-border/70 hover:border-coral/50 hover:shadow-md'
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/60 bg-background">
        <img
          src={imageSrc}
          alt={`${title} exam UI preview`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
        />
        {selected && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-plum-deep shadow">
            <CheckCircle className="h-3 w-3" /> Selected
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {disabled && disabledHint ? disabledHint : subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

// Four segments, one per timed section, filled in order as progress advances.
function LoadingPanel({ title, detail, progress }: { title: string; detail: string; progress: number | null }) {
  const total = SECTIONS.reduce((n, sec) => n + sec.minutes, 0);
  let start = 0;
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col items-center justify-center px-4 py-10 text-center" role="status" aria-live="polite">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{detail}</p>

      <div className="mt-8 flex w-full gap-1.5" aria-hidden="true">
        {SECTIONS.map((sec) => {
          const share = (sec.minutes / total) * 100;
          const fill = progress === null ? 0 : Math.max(0, Math.min(100, ((progress - start) / share) * 100));
          start += share;
          return (
            <div key={sec.key} style={{ flexGrow: sec.minutes, flexBasis: 0 }} className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full bg-primary transition-[width] duration-300 ${progress === null ? 'w-full animate-pulse opacity-40' : ''}`}
                style={progress === null ? undefined : { width: `${fill}%` }}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm tabular-nums text-muted-foreground">
        {progress === null ? 'Just a moment' : `${Math.round(progress)}%`}
      </p>

      <RotatingQuote />

      <p className="mx-auto mt-10 max-w-sm text-xs text-muted-foreground">
        We run on free servers to stay ad-free, so the first load can take a few seconds.
      </p>
    </div>
  );
}

// Attributions are as commonly cited; some are paraphrases of longer passages.
// image: add a link per person (plain <img>, so any host works).
const QUOTES: { text: string; by: string; image?: string }[] = [
  { text: 'You have to dream before your dreams can come true.', by: 'A. P. J. Abdul Kalam' },
  { text: 'If you want to shine like a sun, first burn like a sun.', by: 'A. P. J. Abdul Kalam' },
  { text: 'Arise, awake, and stop not till the goal is reached.', by: 'Swami Vivekananda' },
  { text: 'You can\u2019t cross the sea merely by standing and staring at the water.', by: 'Rabindranath Tagore' },
  { text: 'The future depends on what you do today.', by: 'Mahatma Gandhi' },
];

function RotatingQuote() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);
  const q = QUOTES[i];
  return (
    <figure key={i} className="mt-10 min-h-[5.5rem] animate-in fade-in duration-700">
      <blockquote className="text-balance text-lg font-medium leading-snug">&ldquo;{q.text}&rdquo;</blockquote>
      <figcaption className="mt-3 flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
        {q.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={q.image} alt="" className="h-9 w-9 rounded-full object-cover" />
        )}
        {q.by}
      </figcaption>
    </figure>
  );
}
