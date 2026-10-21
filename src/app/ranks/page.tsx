'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { RanksSeoContent } from '@/components/ranks-seo-content';
import { RanksAppJsonLd } from '@/components/ranks-jsonld';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import {
  TrendingUp,
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Info,
  BarChart3,
  Building2,
  ChevronLeft,
  Sparkles,
  Medal,
  Download,
  GripVertical,
  RefreshCw,
  Link2,
  Check,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Campus,
  Domain,
  CAMPUS_LABELS,
  CAMPUS_SHORT,
  DOMAIN_LABELS,
  COURSE_DATA,
  getEligibleCampuses,
  getCoursesInRankRange,
  getMarksFromRank,
  ALL_DOMAINS,
  ALL_CATEGORIES,
} from '@/lib/viteee-data';
import { buildRanksQuery, parseRanksQuery, RanksAction } from '@/lib/ranks-url';
import type { ReportRow } from '@/lib/ranks-report';

type Step = 'rank' | 'action' | 'preferences' | 'results';

const STEP_ORDER: Step[] = ['rank', 'action', 'preferences', 'results'];
const STEP_LABELS: Record<Step, string> = {
  rank: 'Enter Rank',
  action: 'Choose Action',
  preferences: 'Preferences',
  results: 'Results',
};

const SHARE_BASE = 'https://ranks.vhome.co.in/ranks';

const DOMAIN_OPTIONS: MultiSelectOption<Domain>[] = ALL_DOMAINS.map((d) => ({
  value: d,
  label: DOMAIN_LABELS[d],
}));

const rowKey = (courseId: string, category: number) => `${courseId}-${category}`;

export default function RanksPage() {
  const [step, setStep] = useState<Step>('rank');
  const [rank, setRank] = useState('');
  const [actionType, setActionType] = useState<RanksAction | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [minCategory, setMinCategory] = useState<number | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [customOrder, setCustomOrder] = useState<string[] | null>(null);
  const hydratedRef = useRef(false);

  // Restore from URL after mount to avoid hydration mismatch
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === 'undefined') return;
    const q = parseRanksQuery(window.location.search.replace(/^\?/, ''));
    if (q.rank) setRank(String(q.rank));
    if (q.action) setActionType(q.action);
    if (q.domains.length) setDomains(q.domains);
    if (q.minCategory !== null) setMinCategory(q.minCategory);
    if (q.campuses.length) setCampuses(q.campuses);
    if (q.order) setCustomOrder(q.order);
    if (q.rank && q.action) setStep('results');
    else if (q.rank) setStep('action');
  }, []);

  const rankNum = parseInt(rank, 10);
  const isValidRank = !isNaN(rankNum) && rankNum > 0 && rankNum <= 200000;
  const eligibleCampuses = isValidRank ? getEligibleCampuses(rankNum) : [];

  // Drop campuses no longer eligible (e.g. rank changed past 1,00,000)
  useEffect(() => {
    if (campuses.length === 0) return;
    const filtered = campuses.filter((c) => eligibleCampuses.includes(c));
    if (filtered.length !== campuses.length) setCampuses(filtered);
  }, [eligibleCampuses, campuses]);

  // Sync URL while on results
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (step !== 'results' || !isValidRank || !actionType) return;
    const qs = buildRanksQuery({
      rank: rankNum,
      action: actionType,
      domains,
      minCategory,
      campuses,
      order: actionType === 'counselling' ? customOrder : null,
    });
    const next = `/ranks${qs ? `?${qs}` : ''}`;
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [step, rankNum, actionType, domains, minCategory, campuses, customOrder, isValidRank]);

  const handleActionSelect = (action: RanksAction) => {
    setActionType(action);
    setStep('preferences');
  };

  const handleReset = () => {
    setStep('rank');
    setRank('');
    setActionType(null);
    setDomains([]);
    setMinCategory(null);
    setCampuses([]);
    setCustomOrder(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/ranks');
    }
  };

  const handleBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  };

  const baseRows = useMemo(() => {
    if (!isValidRank || step !== 'results') return [];
    return getCoursesInRankRange(rankNum, 2500, {
      domains,
      minCategory: minCategory ?? undefined,
      campuses: campuses.length > 0 ? campuses : undefined,
    });
  }, [isValidRank, rankNum, step, domains, minCategory, campuses]);

  const orderedRows = useMemo(() => {
    if (!customOrder || customOrder.length === 0) return baseRows;
    const map = new Map(baseRows.map((r) => [rowKey(r.course.id, r.category), r]));
    const out: typeof baseRows = [];
    for (const k of customOrder) {
      const item = map.get(k);
      if (item) {
        out.push(item);
        map.delete(k);
      }
    }
    return [...out, ...map.values()];
  }, [baseRows, customOrder]);

  // Trim stale keys from order when filters change
  useEffect(() => {
    if (!customOrder) return;
    const valid = new Set(baseRows.map((r) => rowKey(r.course.id, r.category)));
    const trimmed = customOrder.filter((k) => valid.has(k));
    if (trimmed.length !== customOrder.length) {
      setCustomOrder(trimmed.length > 0 ? trimmed : null);
    }
  }, [baseRows, customOrder]);

  const marksInfo = isValidRank ? getMarksFromRank(rankNum) : null;
  const stepIdx = STEP_ORDER.indexOf(step);
  const isHero = step === 'rank';

  const [showAllAnalysisCourses, setShowAllAnalysisCourses] = useState(false);
  const [showAllCounsellingRows, setShowAllCounsellingRows] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCopyShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // Fallback: open in new tab so user can copy from address bar
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const securableCourses = useMemo(() => {
    if (!isValidRank || actionType !== 'analysis' || step !== 'results') return [];
    const activeCampuses = campuses.length > 0 ? campuses : eligibleCampuses;
    const activeDomains = domains.length > 0 ? new Set(domains) : null;
    const minCat = minCategory ?? 1;
    return COURSE_DATA.filter((c) => activeCampuses.includes(c.campus))
      .filter((c) => !activeDomains || activeDomains.has(c.domain))
      .map((course) => {
        const secured = course.categories
          .map((closingRank, i) => ({ cat: i + 1, closingRank }))
          .filter((x) => x.cat >= minCat && rankNum <= x.closingRank);
        return { course, secured };
      })
      .filter((x) => x.secured.length > 0)
      .sort((a, b) => a.secured[0].closingRank - b.secured[0].closingRank);
  }, [
    isValidRank,
    actionType,
    step,
    rankNum,
    eligibleCampuses,
    domains,
    campuses,
    minCategory,
  ]);

  const shareUrl = useMemo(() => {
    if (!isValidRank || !actionType) return SHARE_BASE;
    const qs = buildRanksQuery({
      rank: rankNum,
      action: actionType,
      domains,
      minCategory,
      campuses,
      order: actionType === 'counselling' ? customOrder : null,
    });
    return qs ? `${SHARE_BASE}?${qs}` : SHARE_BASE;
  }, [isValidRank, rankNum, actionType, domains, minCategory, campuses, customOrder]);

  // Drag-and-drop reordering
  const dragKeyRef = useRef<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const reorder = (fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;
    const keys = orderedRows.map((r) => rowKey(r.course.id, r.category));
    const fromIdx = keys.indexOf(fromKey);
    const toIdx = keys.indexOf(toKey);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...keys];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setCustomOrder(next);
  };

  const moveRow = (fromKey: string, dir: -1 | 1) => {
    const keys = orderedRows.map((r) => rowKey(r.course.id, r.category));
    const idx = keys.indexOf(fromKey);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= keys.length) return;
    reorder(fromKey, keys[target]);
  };

  // Hidden QR canvas for PDF export
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (typeof window === 'undefined') return;
    const canvas = qrContainerRef.current?.querySelector<HTMLCanvasElement>('canvas');
    const qrDataURL = canvas ? canvas.toDataURL('image/png') : '';
    const rows: ReportRow[] = orderedRows.map((r) => ({
      key: rowKey(r.course.id, r.category),
      campus: CAMPUS_SHORT[r.course.campus],
      course: r.course.shortName,
      category: `Cat ${r.category}`,
      closingRank: r.closingRank.toLocaleString('en-IN'),
      status: rankNum <= r.closingRank ? 'Secured' : 'Reach',
      isNew: r.course.isNewCourse,
    }));
    // Lazy-load jspdf only in the browser, on demand. Keeps the PDF stack
    // out of the SSR bundle and the initial client chunk.
    const { generateReport } = await import('@/lib/ranks-report');
    await generateReport({
      rank: rankNum,
      actionType: actionType ?? 'counselling',
      domains,
      minCategory,
      campuses: campuses.length > 0 ? campuses : eligibleCampuses,
      rows,
      qrDataURL,
      shareUrl,
    });
  };

  const campusOptions: MultiSelectOption<Campus>[] = eligibleCampuses.map((c) => ({
    value: c,
    label: CAMPUS_LABELS[c],
  }));

  const hasCustomOrder = customOrder !== null && customOrder.length > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <RanksAppJsonLd />
      <Header />
      <main className="flex-1">
        <TooltipProvider delayDuration={150}>
          {/* Hidden QR for PDF export */}
          <div
            ref={qrContainerRef}
            aria-hidden
            className="pointer-events-none fixed -left-[9999px] -top-[9999px] opacity-0"
          >
            <QRCodeCanvas value={shareUrl} size={400} level="M" includeMargin />
          </div>

          {/* Adaptive header */}
          <section
            className={cn(
              'relative isolate overflow-hidden hero-mesh',
              isHero
                ? 'flex min-h-[calc(100dvh-3.5rem)] items-center py-16 md:py-20'
                : 'py-10 md:py-12',
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div
                className={cn(
                  'absolute -top-24 -left-16 rounded-full blur-3xl animate-blob-slow',
                  isHero ? 'h-[32rem] w-[32rem]' : 'h-72 w-72',
                )}
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--coral) / 0.55), transparent 60%)',
                }}
              />
              <div
                className={cn(
                  'absolute bottom-0 -right-24 rounded-full blur-3xl animate-blob',
                  isHero ? 'h-[30rem] w-[30rem]' : 'h-64 w-64',
                )}
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)',
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
            <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

            <div className="container relative z-10 mx-auto max-w-4xl px-4">
              <AnimatePresence mode="wait">
                {isHero ? (
                  <motion.div
                    key="hero-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.55 }}
                      className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
                    >
                      <Medal className="h-3.5 w-3.5 text-coral" />
                      VIT Rank &amp; College Predictor 2027
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center text-[clamp(2rem,6vw,4rem)] font-semibold leading-[0.92] tracking-tighter text-white"
                    >
                      Predict Your{' '}
                      <span className="font-display italic gradient-text">VIT Rank</span>
                      <br />
                      &amp; Counselling Options
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="mx-auto mt-6 max-w-2xl text-center text-base text-white/70 md:text-lg"
                    >
                      Built from publicly scraped 2025 cutoff data - not official VIT
                      figures. Use it to understand where your rank lands, not as a
                      guarantee.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mx-auto mt-10 max-w-md"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-coral/20 to-mint/20 blur-2xl" />
                        <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                          <Label htmlFor="rank-input" className="text-sm font-medium text-white/90">
                            Enter your VITEEE Rank
                          </Label>
                          <Input
                            id="rank-input"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 5000"
                            value={rank}
                            onChange={(e) => setRank(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && isValidRank) setStep('action');
                            }}
                            className="mt-3 h-12 border-white/20 bg-white/5 text-lg text-white placeholder:text-white/40"
                          />
                          <p className="mt-2 text-xs text-white/50">
                            Enter a number between 1 and 2,00,000
                          </p>
                          <Button
                            onClick={() => isValidRank && setStep('action')}
                            disabled={!isValidRank}
                            className="shimmer-border group mt-4 h-12 w-full gap-2 rounded-full bg-white px-6 text-base font-semibold text-plum-deep hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Sparkles className="h-4 w-4 text-coral transition-transform group-hover:rotate-12" />
                            Start Analysis
                          </Button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mx-auto mt-10 flex w-fit max-w-full items-stretch justify-center gap-2 sm:gap-3"
                    >
                      {[
                        { icon: GraduationCap, value: '70+', label: 'Courses' },
                        { icon: Building2, value: '4', label: 'Campuses' },
                        { icon: TrendingUp, value: '2025', label: 'Cutoff Data' },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="glass flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-coral/30 to-peach/30 sm:h-10 sm:w-10">
                            <stat.icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-xl italic leading-none text-white sm:text-2xl">
                              {stat.value}
                            </p>
                            <p className="mt-1 truncate text-[10px] uppercase tracking-widest text-white/60 sm:text-[11px]">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.65 }}
                      className="mt-6 flex justify-center"
                    >
                      <Link
                        href="/ranks/info"
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 sm:gap-3 sm:px-7 sm:text-base"
                      >
                        <Compass className="h-4 w-4 text-coral transition-transform group-hover:rotate-12 sm:h-5 sm:w-5" />
                        Read the data behind this predictor
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hero-compact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                        <Medal className="h-6 w-6 text-coral" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                          Your Rank
                        </p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                          #{rankNum.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="h-9 gap-1 text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 gap-2 border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        New Rank
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isHero && (
                <div className="mt-8 flex items-center gap-2">
                  {STEP_ORDER.map((s, i) => {
                    const active = i === stepIdx;
                    const done = i < stepIdx;
                    return (
                      <div key={s} className="flex flex-1 items-center gap-2">
                        <div
                          className={cn(
                            'flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[11px] font-semibold transition-colors',
                            active &&
                              'border-coral bg-coral text-plum-deep shadow-md shadow-coral/30',
                            done && 'border-mint/60 bg-mint/20 text-mint',
                            !active && !done && 'border-white/20 bg-white/5 text-white/50',
                          )}
                        >
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        <span
                          className={cn(
                            'hidden text-xs font-medium sm:inline',
                            active ? 'text-white' : 'text-white/50',
                          )}
                        >
                          {STEP_LABELS[s]}
                        </span>
                        {i < STEP_ORDER.length - 1 && (
                          <div
                            className={cn(
                              'h-px flex-1',
                              done ? 'bg-mint/40' : 'bg-white/10',
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <AnimatePresence mode="wait">
            {/* Step 2: Action Selection */}
            {step === 'action' && (
              <motion.section
                key="action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="container mx-auto max-w-4xl px-4 py-10 md:py-14"
              >
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                    Step 2 of 4
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    What do you want to do?
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Pick how to use your rank. You can switch between Analysis and
                    Counselling on the results page anytime.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => handleActionSelect('analysis')}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-coral/50 hover:shadow-xl hover:shadow-coral/10"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
                        <BarChart3 className="h-6 w-6 text-coral" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">
                        Rank Analysis
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        See estimated marks, eligible campuses, and how many courses
                        match each domain at your rank.
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-coral">
                        Choose
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleActionSelect('counselling')}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-mint/50 hover:shadow-xl hover:shadow-mint/10"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mint/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-sky/20">
                        <Building2 className="h-6 w-6 text-mint" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">
                        Counselling Options
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Generate a list of courses you can secure or reach within your
                        rank range, filtered by your preferences.
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-mint">
                        Choose
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                </div>
              </motion.section>
            )}

            {/* Step 3: Preferences */}
            {step === 'preferences' && (
              <motion.section
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="container mx-auto max-w-3xl px-4 py-10 md:py-14"
              >
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">
                    Step 3 of 4
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Set your preferences
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    All filters are optional. Pick multiple domains or campuses for a
                    broader view.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-xl md:p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Domains</Label>
                      <MultiSelect
                        options={DOMAIN_OPTIONS}
                        value={domains}
                        onChange={setDomains}
                        placeholder="Pick one or more"
                        allLabel="All Domains"
                      />
                      <p className="text-xs text-muted-foreground">
                        Select multiple domains, or leave as{' '}
                        <span className="font-medium text-foreground">All</span> to
                        compare across CS, Electronics, Mechanical and Core.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">
                          Minimum Fee Category
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
                              aria-label="Fee category info"
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              <span className="font-semibold">Cat 1</span> = lowest
                              fees (~₹1.73L/yr).{' '}
                              <span className="font-semibold">Cat 5</span> = highest
                              (~₹3.95L/yr).
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Picking{' '}
                              <span className="font-medium">Cat 2</span> shows Cat 2,
                              3, 4 and 5 - every category that costs at least that
                              much.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={minCategory === null ? 'all' : String(minCategory)}
                        onValueChange={(v) =>
                          setMinCategory(v === 'all' ? null : parseInt(v, 10))
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {ALL_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={String(cat)}>
                              Cat {cat} and higher
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Includes the picked category and every higher one - Cat 1
                        returns Cat 1–5.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Campuses</Label>
                      <MultiSelect
                        options={campusOptions}
                        value={campuses}
                        onChange={setCampuses}
                        placeholder="Pick one or more"
                        allLabel="All Eligible Campuses"
                      />
                      {rankNum > 100000 && (
                        <p className="flex items-center gap-1 text-xs text-amber-500">
                          <AlertCircle className="h-3 w-3" />
                          Ranks above 1,00,000 are eligible only for VIT AP &amp; VIT
                          Bhopal.
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => setStep('results')}
                      className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-coral to-peach text-base font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach"
                    >
                      Generate Results
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Step 4: Results */}
            {step === 'results' && (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="container mx-auto max-w-5xl px-4 py-10 md:py-14"
              >
                {/* Action toggle + active filters */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="inline-flex w-fit rounded-xl border border-border/60 bg-card/60 p-1 backdrop-blur">
                    <button
                      onClick={() => setActionType('analysis')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        actionType === 'analysis'
                          ? 'bg-coral text-plum-deep shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Analysis
                    </button>
                    <button
                      onClick={() => setActionType('counselling')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        actionType === 'counselling'
                          ? 'bg-mint text-plum-deep shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Building2 className="h-4 w-4" />
                      Counselling
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full">
                      Domains:{' '}
                      {domains.length === 0 || domains.length === ALL_DOMAINS.length
                        ? 'All'
                        : domains.length === 1
                          ? DOMAIN_LABELS[domains[0]]
                          : `${domains.length} picked`}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      Category:{' '}
                      {minCategory === null ? 'All' : `Cat ${minCategory}+`}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      Campuses:{' '}
                      {campuses.length === 0 ||
                      campuses.length === eligibleCampuses.length
                        ? 'All eligible'
                        : campuses.length === 1
                          ? CAMPUS_SHORT[campuses[0]]
                          : `${campuses.length} picked`}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('preferences')}
                      className="h-7 gap-1 px-2 text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Rank Analysis Results */}
                {actionType === 'analysis' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/15 blur-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-coral" />
                          Estimated Marks
                        </div>
                        {marksInfo ? (
                          <>
                            <p className="mt-3 text-4xl font-semibold tracking-tight">
                              {marksInfo.minMarks} – {marksInfo.maxMarks}
                              <span className="ml-2 text-lg font-normal text-muted-foreground">
                                / 500
                              </span>
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <Badge
                                variant={
                                  marksInfo.confidence === 'High'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {marksInfo.confidence} confidence
                              </Badge>
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">
                              Based on 2025 VITEEE data (125 questions, +4 correct, −1
                              wrong).
                            </p>
                          </>
                        ) : (
                          <p className="mt-3 text-muted-foreground">
                            Unable to estimate marks for this rank.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mint/15 blur-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Building2 className="h-4 w-4 text-mint" />
                          Eligible Campuses
                        </div>
                        <div className="mt-4 space-y-2">
                          {eligibleCampuses.map((c) => (
                            <div key={c} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-mint" />
                              <span className="text-sm">{CAMPUS_LABELS[c]}</span>
                            </div>
                          ))}
                          {eligibleCampuses.length === 4 && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              All four VIT campuses are open for your rank.
                            </p>
                          )}
                          {eligibleCampuses.length === 2 && (
                            <p className="mt-2 text-xs text-amber-500">
                              Above 1,00,000 rank, only AP &amp; Bhopal admit
                              students.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Award className="h-4 w-4 text-lavender" />
                          Domain-wise options near your rank
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {(domains.length > 0 ? domains : ALL_DOMAINS).map((d) => {
                            const activeCampuses =
                              campuses.length > 0 ? campuses : eligibleCampuses;
                            const minCat = minCategory ?? 1;
                            // Match the list logic: count distinct courses where the user
                            // can secure at least one category at or above minCat.
                            const domainCourses = COURSE_DATA.filter(
                              (c) =>
                                c.domain === d &&
                                activeCampuses.includes(c.campus) &&
                                c.categories.some(
                                  (cr, i) => i + 1 >= minCat && rankNum <= cr,
                                ),
                            ).sort(
                              (a, b) =>
                                a.categories[minCat - 1] - b.categories[minCat - 1],
                            );
                            const top = domainCourses[0]
                              ? { course: domainCourses[0] }
                              : null;
                            return (
                              <div
                                key={d}
                                className="rounded-xl border border-border/40 bg-background/50 p-4"
                              >
                                <p className="text-sm font-medium">
                                  {DOMAIN_LABELS[d]}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-coral">
                                  {domainCourses.length}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {domainCourses.length === 1
                                    ? 'course you can secure'
                                    : 'courses you can secure'}
                                </p>
                                {top && (
                                  <p className="mt-2 truncate text-xs text-muted-foreground">
                                    Top: {top.course.shortName} (
                                    {CAMPUS_SHORT[top.course.campus]})
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Possible courses (card grid) */}
                    <div className="md:col-span-2">
                      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-mint" />
                            Courses you can secure
                            <Badge variant="outline" className="ml-1 rounded-full text-[10px]">
                              {securableCourses.length}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Sorted by closest secured cutoff. Lower cat = lower fees.
                          </p>
                        </div>

                        {securableCourses.length > 0 ? (
                          <>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {(showAllAnalysisCourses
                                ? securableCourses
                                : securableCourses.slice(0, 12)
                              ).map(({ course, secured }) => {
                                const best = secured[0];
                                return (
                                  <div
                                    key={course.id}
                                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/50 p-4 transition-colors hover:border-mint/50"
                                  >
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-mint/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative z-10">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                          {CAMPUS_SHORT[course.campus]}
                                        </p>
                                        {course.isNewCourse && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge
                                                variant="outline"
                                                className="px-1.5 py-0 text-[10px]"
                                              >
                                                New
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="max-w-xs text-xs">
                                                2025 cutoff data not available. Estimated
                                                based on similar courses.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </div>
                                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-tight">
                                        {course.shortName}
                                      </p>
                                      <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-xl font-semibold tracking-tight text-mint">
                                          Cat {best.cat}+
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          @ {best.closingRank.toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] font-normal"
                                        >
                                          {DOMAIN_LABELS[course.domain]}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground">
                                          {secured.length}/5 categories secured
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {securableCourses.length > 12 && (
                              <div className="mt-4 flex justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setShowAllAnalysisCourses((s) => !s)
                                  }
                                  className="gap-1.5"
                                >
                                  {showAllAnalysisCourses
                                    ? 'Show less'
                                    : `Show all ${securableCourses.length} courses`}
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="mt-6 rounded-xl border border-dashed border-border/40 bg-background/30 py-10 text-center">
                            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
                            <p className="mt-3 text-sm text-muted-foreground">
                              No courses secured at this rank. Try the Counselling tab to
                              see reach options.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Counselling Options Results */}
                {actionType === 'counselling' && (
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-xl">
                    <div className="flex flex-col gap-3 border-b border-border/40 p-4 sm:p-6">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                          Counselling Options
                        </h3>
                        <Badge variant="outline" className="shrink-0">
                          {orderedRows.length} matches
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Drag rows to reorder, or use the arrow buttons. Your order is
                        saved in the URL and the QR.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {hasCustomOrder && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCustomOrder(null)}
                            className="h-9 flex-1 gap-1.5 text-xs sm:flex-initial"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reset order
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyShare}
                          disabled={orderedRows.length === 0}
                          className="h-9 flex-1 gap-1.5 text-xs sm:flex-initial"
                        >
                          {copiedShare ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-mint" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Link2 className="h-3.5 w-3.5" />
                              Copy link
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleDownload}
                          disabled={orderedRows.length === 0}
                          className="h-9 flex-1 gap-1.5 bg-gradient-to-r from-coral to-peach text-xs font-semibold text-plum-deep shadow-md shadow-coral/20 hover:from-coral hover:to-peach sm:flex-initial"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download PDF
                        </Button>
                      </div>
                    </div>

                    {orderedRows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/40 hover:bg-transparent">
                              <TableHead className="w-12 text-center text-muted-foreground">
                                #
                              </TableHead>
                              <TableHead className="w-10 text-muted-foreground" />
                              <TableHead className="text-muted-foreground">
                                Campus
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Course
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Category
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Closing Rank
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(showAllCounsellingRows
                              ? orderedRows
                              : orderedRows.slice(0, 80)
                            ).map((item, idx, arr) => {
                              const key = rowKey(item.course.id, item.category);
                              const secured = rankNum <= item.closingRank;
                              const isOver = dragOverKey === key;
                              return (
                                <TableRow
                                  key={key}
                                  draggable
                                  onDragStart={(e) => {
                                    dragKeyRef.current = key;
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData('text/plain', key);
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                    if (dragOverKey !== key) setDragOverKey(key);
                                  }}
                                  onDragLeave={() => {
                                    if (dragOverKey === key) setDragOverKey(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const from =
                                      dragKeyRef.current ??
                                      e.dataTransfer.getData('text/plain');
                                    setDragOverKey(null);
                                    dragKeyRef.current = null;
                                    if (from) reorder(from, key);
                                  }}
                                  onDragEnd={() => {
                                    dragKeyRef.current = null;
                                    setDragOverKey(null);
                                  }}
                                  className={cn(
                                    'cursor-move border-border/30 transition-colors',
                                    isOver && 'bg-coral/10 outline outline-1 outline-coral/40',
                                  )}
                                >
                                  <TableCell className="text-center font-mono text-sm text-muted-foreground">
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell className="px-1">
                                    <div className="flex items-center gap-0.5">
                                      <span
                                        className="cursor-grab text-muted-foreground/60 hover:text-foreground"
                                        aria-hidden
                                      >
                                        <GripVertical className="h-4 w-4" />
                                      </span>
                                      <div className="flex flex-col">
                                        <button
                                          type="button"
                                          onClick={() => moveRow(key, -1)}
                                          disabled={idx === 0}
                                          aria-label="Move up"
                                          className="-mb-0.5 text-muted-foreground/70 hover:text-foreground disabled:opacity-30"
                                        >
                                          <svg
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                          >
                                            <path
                                              d="M1 5L5 1L9 5"
                                              stroke="currentColor"
                                              strokeWidth="1.6"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => moveRow(key, 1)}
                                          disabled={idx === arr.length - 1}
                                          aria-label="Move down"
                                          className="text-muted-foreground/70 hover:text-foreground disabled:opacity-30"
                                        >
                                          <svg
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                          >
                                            <path
                                              d="M1 1L5 5L9 1"
                                              stroke="currentColor"
                                              strokeWidth="1.6"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      {CAMPUS_SHORT[item.course.campus]}
                                      {item.course.isNewCourse && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge
                                              variant="outline"
                                              className="px-1.5 py-0 text-[10px]"
                                            >
                                              New
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs text-xs">
                                              2025 cutoff data not available.
                                              Estimated based on similar courses.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {item.course.shortName}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        item.category <= 2
                                          ? 'default'
                                          : item.category <= 3
                                            ? 'secondary'
                                            : 'outline'
                                      }
                                    >
                                      Cat {item.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {item.closingRank.toLocaleString('en-IN')}
                                  </TableCell>
                                  <TableCell>
                                    {secured ? (
                                      <span className="inline-flex items-center gap-1 text-sm text-mint">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Secured
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-sm text-amber-500">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Reach
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">
                          No courses matched within ±2,500 of your rank.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDomains([]);
                            setMinCategory(null);
                            setCampuses([]);
                            setCustomOrder(null);
                            setStep('preferences');
                          }}
                          className="mt-4"
                        >
                          Adjust Filters
                        </Button>
                      </div>
                    )}

                    {orderedRows.length > 80 && (
                      <div className="flex items-center justify-center gap-3 border-t border-border/40 py-4 text-sm text-muted-foreground">
                        <span>
                          {showAllCounsellingRows
                            ? `Showing all ${orderedRows.length} matches.`
                            : `Showing top 80 of ${orderedRows.length} matches.`}
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setShowAllCounsellingRows((s) => !s)}
                          className="h-auto p-0 text-xs"
                        >
                          {showAllCounsellingRows ? 'Show top 80' : 'Show all'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-amber-500">
                          Unofficial data - use as guidance only
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          All cutoffs and rank ladders shown here were scraped from
                          public sources (CollegeDunia, GetMyUni, CollegeDekho,
                          Careers360). VIT does <strong>not</strong> publish a clean
                          marks-vs-rank table, and category cutoffs change every year.
                          Treat this as a way to understand where your rank lands -
                          not as an official prediction.{' '}
                          <Link
                            href="/ranks/info"
                            className="font-medium text-coral underline-offset-2 hover:underline"
                          >
                            Read the full data notes →
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-card/40 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">About new 2026 courses</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Some courses listed are new for 2026 and don&apos;t have
                          2025 cutoff data. Their cutoffs are estimated based on
                          similar courses, so treat those rows as approximate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* SEO content - only on the rank/landing step. Keeps the predictor
              UI clean once a user starts interacting, but gives Google a rich,
              keyword-targeted body of content on the page that ships in SSR. */}
          {isHero && <RanksSeoContent />}
        </TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}
