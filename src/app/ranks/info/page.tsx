'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  BookOpen,
  Calculator,
  Building2,
  TrendingUp,
  Compass,
  Target,
  AlertTriangle,
  Link2,
  ArrowRight,
  ArrowLeft,
  Layers,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Campus,
  CAMPUS_LABELS,
  COURSE_DATA,
  MARKS_TO_RANK,
  ALL_CAMPUSES,
  DOMAIN_LABELS,
} from '@/lib/viteee-data';

type SectionId =
  | 'exam'
  | 'counselling'
  | 'marks'
  | 'cutoffs'
  | 'patterns'
  | 'heuristics'
  | 'caveats'
  | 'sources';

interface SectionMeta {
  id: SectionId;
  title: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const SECTIONS: SectionMeta[] = [
  {
    id: 'exam',
    title: 'Exam Pattern',
    blurb: '125 questions, no negative marking, equi-percentile rank list.',
    icon: BookOpen,
    accent: 'from-coral/30 to-peach/30 text-coral',
  },
  {
    id: 'counselling',
    title: 'Counselling Eligibility',
    blurb: 'Who can pick which campus, and how categories work.',
    icon: Layers,
    accent: 'from-mint/30 to-sky/30 text-mint',
  },
  {
    id: 'marks',
    title: 'Marks → Rank',
    blurb: 'Estimated marks-to-rank ladder from public sources.',
    icon: Calculator,
    accent: 'from-lavender/30 to-coral/30 text-lavender',
  },
  {
    id: 'cutoffs',
    title: 'Campus Cutoffs',
    blurb: '2025 closing ranks per category for every programme.',
    icon: Building2,
    accent: 'from-sky/30 to-mint/30 text-sky',
  },
  {
    id: 'patterns',
    title: 'Campus Patterns',
    blurb: 'How Vellore, Chennai, AP and Bhopal compared in 2025.',
    icon: TrendingUp,
    accent: 'from-peach/30 to-coral/30 text-peach',
  },
  {
    id: 'heuristics',
    title: 'Rank Band Outlook',
    blurb: 'What to realistically expect at each rank band for 2026.',
    icon: Target,
    accent: 'from-coral/30 to-mint/30 text-coral',
  },
  {
    id: 'caveats',
    title: 'Modeling Notes',
    blurb: 'Where the data is sharp, and where it is fuzzy.',
    icon: AlertTriangle,
    accent: 'from-amber-500/30 to-coral/30 text-amber-500',
  },
  {
    id: 'sources',
    title: 'Sources',
    blurb: 'Official VIT pages and the public 2025 cutoff datasets used.',
    icon: Link2,
    accent: 'from-mint/30 to-lavender/30 text-mint',
  },
];

const RANK_BANDS: { range: string; outlook: string }[] = [
  { range: '1 – 2,000', outlook: 'Strong shot at Vellore Cat 1 in top CS-family branches.' },
  { range: '2,000 – 5,000', outlook: 'Vellore lower Cat 1/2 in CS-family; Chennai Cat 1 in CS-family.' },
  { range: '5,000 – 15,000', outlook: 'Vellore CS higher cats or electronics; Chennai strong CS/electronics.' },
  { range: '15,000 – 35,000', outlook: 'Chennai Cat 2–5 very relevant; Vellore electronics or non-CS.' },
  { range: '35,000 – 70,000', outlook: 'AP and Bhopal Cat 1–3 become strong; Chennai core opens up.' },
  { range: '70,000 – 1,00,000', outlook: 'AP/Bhopal viable across many branches; Chennai core only.' },
  { range: '1,00,000+', outlook: 'AP and Bhopal only per 2025 rule; highest cats and least competitive branches.' },
];

const FEE_GROUPS: { group: string; tuition: string; note?: string }[] = [
  { group: 'Group A · B.Tech', tuition: '₹1,73,000 / year', note: 'Lowest fee tier, typically Cat 1 cohorts.' },
  { group: 'Group B · B.Tech', tuition: '₹1,95,000 / year' },
  { group: 'Group B · Bhopal', tuition: '₹1,98,000 / year', note: 'Bhopal-specific rate.' },
];

const MODEL_NOTES = [
  'Treat marks → rank as an estimated overlay, never as a guarantee.',
  'Treat rank → campus/branch/category as the primary prediction layer.',
  'Use branch families (CS, Electronics, Mech/Core, Bio/Health), not just branch names.',
  'High confidence when the 2025 row exists; medium when only a label is mapped; low when the row is missing.',
  'Vellore: some core branches lack higher-category rows in the public 2025 dataset.',
  'Bhopal: official programme names often differ from cutoff-page labels — names are reconciled where possible.',
  'A few articles labelled “2025” reuse 2024 numbers (e.g. Vellore CSE Cat 1 = 548 vs 600). Those are excluded.',
  'For ranks above 1,00,000, only AP and Bhopal are admissible per the 2025 counselling rule.',
];

const SOURCES = [
  { label: 'Official VITEEE 2025 microsite', url: 'https://viteee.vit.ac.in/' },
  { label: 'VIT UG fee structure', url: 'https://vit.ac.in/admission/ug/fee-structure' },
  {
    label: 'VIT Vellore 2025 cutoffs',
    url: 'https://collegedunia.com/university/25914-vellore-institute-of-technology-vit-university-vellore/viteee-2025-cutoff',
  },
  {
    label: 'VIT Chennai 2025 cutoffs',
    url: 'https://collegedunia.com/university/56865-vellore-institute-of-technology-vit-chennai-chennai/viteee-2025-cutoff',
  },
  {
    label: 'VIT AP 2025 cutoffs',
    url: 'https://collegedunia.com/university/59270-vit-university-vit-ap-guntur/viteee-2025-cutoff',
  },
  {
    label: 'VIT Bhopal 2025 cutoffs',
    url: 'https://collegedunia.com/university/59253-vit-bhopal-university-bhopal/viteee-2025-cutoff',
  },
  { label: 'GetMyUni — Marks vs Rank', url: 'https://www.getmyuni.com/exams/viteee-marks-vs-rank' },
  { label: 'CollegeDekho — Marks vs Rank (CSE)', url: 'https://www.collegedekho.com/articles/viteee-marks-vs-rank-for-cse/' },
];

export default function RanksInfoPage() {
  const [campusTab, setCampusTab] = useState<Campus>('vellore');

  const coursesForCampus = (c: Campus) =>
    COURSE_DATA.filter((co) => co.campus === c);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <TooltipProvider delayDuration={150}>
          {/* Hero with section nav */}
          <section className="relative isolate overflow-hidden hero-mesh py-16 md:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute -top-24 -left-16 h-[28rem] w-[28rem] rounded-full blur-3xl animate-blob-slow"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--coral) / 0.5), transparent 60%)',
                }}
              />
              <div
                className="absolute bottom-0 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl animate-blob"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--mint) / 0.4), transparent 60%)',
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 reveal-mask" />
            <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

            <div className="container relative z-10 mx-auto max-w-6xl px-4">
              <div className="mb-3 flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/ranks">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to predictor
                  </Link>
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
              >
                <Compass className="h-3.5 w-3.5 text-coral" />
                The data behind the predictor
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[0.95] tracking-tighter text-white"
              >
                Everything we know about{' '}
                <span className="font-display italic gradient-text">VITEEE 2025</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-5 max-w-2xl text-balance text-base text-white/70 md:text-lg"
              >
                The exam pattern, counselling rule, marks-to-rank ladder and every public
                campus cutoff we use to power the predictor — laid out section by section.
              </motion.p>

              {/* Unofficial data disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-300/40 bg-amber-500/10 p-4 backdrop-blur-md"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-amber-100">
                    Unofficial data — scraped from public sources
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">
                    None of these numbers come from VIT directly. They&apos;re compiled
                    from CollegeDunia, GetMyUni, CollegeDekho and Careers360. VIT
                    publishes the programme list, the equi-percentile rank rule, and
                    the counselling eligibility, but <strong>not</strong> a clean raw
                    marks-vs-rank table. Use this page to <em>understand</em> where a
                    rank lands historically — not as an official prediction or
                    guarantee.
                  </p>
                </div>
              </motion.div>

              {/* Section nav grid */}
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SECTIONS.map((s, i) => (
                  <motion.a
                    key={s.id}
                    href={`#${s.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.04 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-coral/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br',
                          s.accent,
                        )}
                      >
                        <s.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold tracking-tight text-white">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-xs leading-snug text-white/60">{s.blurb}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                        Read
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>

          {/* Sections */}
          <div className="container mx-auto max-w-5xl space-y-16 px-4 py-16 md:space-y-20 md:py-20">
            {/* Exam Pattern */}
            <Section id="exam" title="Exam Pattern" icon={BookOpen} eyebrow="Section 1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Stat label="Questions" value="125" hint="1 mark each, total 500" />
                <Stat label="Negative marking" value="None" hint="Wrong answers carry zero penalty" />
                <Stat label="Rank list" value="Equi-percentile" hint="Identical raw marks may map differently after normalization" />
                <Stat label="Counselling pick" value="3-axis" hint="Campus + Programme + Fee Category" />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                VITEEE is a single-shot online entrance for B.Tech admissions across the
                four VIT campuses. Because the rank list uses{' '}
                <span className="font-medium text-foreground">equi-percentile normalization</span>,
                every public marks-vs-rank table you find online is an estimate, not a
                lookup table.
              </p>

              <div className="mt-8">
                <h3 className="text-sm font-semibold tracking-tight">Annual fee groups (2025–26)</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {FEE_GROUPS.map((g) => (
                    <div
                      key={g.group}
                      className="rounded-xl border border-border/40 bg-card/60 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {g.group}
                      </p>
                      <p className="mt-2 text-xl font-semibold tracking-tight">{g.tuition}</p>
                      {g.note && (
                        <p className="mt-2 text-xs text-muted-foreground">{g.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Counselling Eligibility */}
            <Section id="counselling" title="Counselling Eligibility" icon={Layers} eyebrow="Section 2">
              <div className="grid gap-4 md:grid-cols-2">
                <RuleCard
                  rank="Rank ≤ 1,00,000"
                  campuses={['VIT Vellore', 'VIT Chennai', 'VIT AP', 'VIT Bhopal']}
                  tone="mint"
                />
                <RuleCard
                  rank="Rank > 1,00,000"
                  campuses={['VIT AP', 'VIT Bhopal']}
                  tone="amber"
                />
              </div>

              <div className="mt-8 rounded-xl border border-border/60 bg-card/60 p-5">
                <h3 className="text-sm font-semibold tracking-tight">
                  How &ldquo;Category&rdquo; actually works
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                    VIT&apos;s category is a <strong className="text-foreground">fee tier</strong>, not a reservation slot.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                    Cat 1 = lowest fees; Cat 5 = highest. Higher cats accept higher (worse) ranks.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                    No fixed global rule like &ldquo;1–20k → Cat 1&rdquo;. The cutoff depends on campus, branch, seat
                    availability and demand.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                    Always read your eligibility as <em>(rank, campus, branch) → likely category</em>.
                  </li>
                </ul>
              </div>
            </Section>

            {/* Marks vs Rank */}
            <Section id="marks" title="Marks → Rank Ladder" icon={Calculator} eyebrow="Section 3">
              <p className="text-sm text-muted-foreground">
                Estimates compiled from CollegeDekho, Careers360 and GetMyUni. High and
                mid score bands are consistent across sources; low bands are fuzzier.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Marks (out of 125)</TableHead>
                      <TableHead className="text-muted-foreground">Expected rank</TableHead>
                      <TableHead className="text-muted-foreground">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MARKS_TO_RANK.map((row, i) => (
                      <TableRow key={i} className="border-border/30">
                        <TableCell className="font-mono text-sm">
                          {row.minMarks}–{row.maxMarks}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {row.minRank.toLocaleString('en-IN')}–{row.maxRank.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.confidence === 'High'
                                ? 'default'
                                : row.confidence.startsWith('Medium')
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {row.confidence}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Insight tone="coral" headline="90+ marks">
                  Range for Vellore/Chennai top CS-family branches.
                </Insight>
                <Insight tone="mint" headline="60–90 marks">
                  Vellore non-CS, Chennai higher cats, strong AP/Bhopal CS.
                </Insight>
                <Insight tone="amber" headline="Below 60">
                  Higher fee categories and AP/Bhopal become the realistic path.
                </Insight>
              </div>
            </Section>

            {/* Campus Cutoffs */}
            <Section id="cutoffs" title="Campus-wise 2025 Cutoffs" icon={Building2} eyebrow="Section 4">
              <p className="text-sm text-muted-foreground">
                Closing ranks per fee category, sourced from each campus&apos;s public 2025
                page. New 2026 programmes use estimates based on similar branches.
              </p>

              <div className="mt-5 inline-flex w-full overflow-x-auto rounded-xl border border-border/60 bg-card/60 p-1">
                {ALL_CAMPUSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampusTab(c)}
                    className={cn(
                      'flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      campusTab === c
                        ? 'bg-coral text-plum-deep shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {CAMPUS_LABELS[c]}
                    <span className="ml-2 text-xs opacity-70">
                      {coursesForCampus(c).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Course</TableHead>
                        <TableHead className="text-center text-muted-foreground">Cat 1</TableHead>
                        <TableHead className="text-center text-muted-foreground">Cat 2</TableHead>
                        <TableHead className="text-center text-muted-foreground">Cat 3</TableHead>
                        <TableHead className="text-center text-muted-foreground">Cat 4</TableHead>
                        <TableHead className="text-center text-muted-foreground">Cat 5</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coursesForCampus(campusTab).map((course) => (
                        <TableRow key={course.id} className="border-border/30">
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{course.shortName}</span>
                              <Badge variant="outline" className="text-[10px] font-normal">
                                {DOMAIN_LABELS[course.domain]}
                              </Badge>
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
                                      {course.notes ?? 'New for 2026 — cutoff estimated.'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                          {course.categories.map((rank, i) => (
                            <TableCell
                              key={i}
                              className="text-center font-mono text-sm tabular-nums"
                            >
                              {rank.toLocaleString('en-IN')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Section>

            {/* Campus Patterns */}
            <Section id="patterns" title="Campus Patterns" icon={TrendingUp} eyebrow="Section 5">
              <div className="grid gap-4 md:grid-cols-2">
                <PatternCard
                  campus="VIT Vellore"
                  tag="Toughest by a wide margin"
                  highlights={[
                    'CSE Cat 1 closed near 600.',
                    'Most CS-family branches stayed under ~4,000 even at Cat 1.',
                    'Higher fee cats for Mech/Core not always exposed publicly.',
                  ]}
                />
                <PatternCard
                  campus="VIT Chennai"
                  tag="Competitive but reachable"
                  highlights={[
                    'CSE: Cat 1 at 3,100; Cat 5 at 32,500.',
                    'CS-family stretches up to ~22k–45k by Cat 5.',
                    'Core branches available into the 80k–98.5k range.',
                  ]}
                />
                <PatternCard
                  campus="VIT AP"
                  tag="Wide rank access"
                  highlights={[
                    'CSE: Cat 1 at 28k; Cat 5 at 1,05,000.',
                    'Electronics/mech branches reach into 1.4–1.5 lakh.',
                    'Crucial for ranks above 1 lakh — still admits per 2025 rule.',
                  ]}
                />
                <PatternCard
                  campus="VIT Bhopal"
                  tag="Most forgiving for higher ranks"
                  highlights={[
                    'CSE: Cat 1 at 30k; Cat 5 at 1,10,000.',
                    'Mech and several non-CS branches reach the 1.5 lakh ceiling.',
                    'Naming differs from official 2025 programme list — read carefully.',
                  ]}
                />
              </div>
            </Section>

            {/* Heuristics */}
            <Section id="heuristics" title="Rank Band Outlook" icon={Target} eyebrow="Section 6">
              <p className="text-sm text-muted-foreground">
                A practical reading of where each rank band realistically lands if 2026
                trends hold close to 2025. Not official guarantees.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Rank band</TableHead>
                      <TableHead className="text-muted-foreground">Most realistic outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RANK_BANDS.map((b) => (
                      <TableRow key={b.range} className="border-border/30">
                        <TableCell className="font-mono text-sm font-semibold tabular-nums">
                          {b.range}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {b.outlook}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>

            {/* Modeling Notes */}
            <Section id="caveats" title="Modeling Notes" icon={AlertTriangle} eyebrow="Section 7">
              <ul className="grid gap-3 sm:grid-cols-2">
                {MODEL_NOTES.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl border border-border/40 bg-card/60 p-4 text-sm text-muted-foreground"
                  >
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Sources */}
            <Section id="sources" title="Sources" icon={Link2} eyebrow="Section 8">
              <ul className="grid gap-2 sm:grid-cols-2">
                {SOURCES.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/60 p-4 text-sm transition-colors hover:border-coral/50"
                    >
                      <span className="truncate font-medium">{s.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-coral" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Last updated:{' '}
                  <time dateTime="2026-05-11" className="font-medium text-foreground">
                    11 May 2026
                  </time>
                </span>
                <span aria-hidden>·</span>
                <span>Dataset compiled 2026-04-23</span>
                <span aria-hidden>·</span>
                <a
                  href="/llms-full.txt"
                  className="font-medium text-coral hover:underline"
                >
                  Plain-text export
                </a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Treat all 2025 numbers as a base layer for 2026 prediction, not as
                guaranteed outcomes.
              </p>
            </Section>

            <div className="rounded-2xl border border-coral/20 bg-gradient-to-br from-coral/10 via-transparent to-mint/10 p-6 text-center md:p-10">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Ready to predict your rank?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Plug in your VITEEE rank and see where you land across all four campuses.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-5 h-11 gap-2 rounded-full bg-gradient-to-r from-coral to-peach px-6 text-base font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach"
              >
                <Link href="/ranks">
                  Open the predictor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}

function Section({
  id,
  title,
  icon: Icon,
  eyebrow,
  children,
}: {
  id: SectionId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
          <Icon className="h-5 w-5 text-coral" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function RuleCard({
  rank,
  campuses,
  tone,
}: {
  rank: string;
  campuses: string[];
  tone: 'mint' | 'amber';
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5',
        tone === 'mint'
          ? 'border-mint/30 bg-mint/5'
          : 'border-amber-500/30 bg-amber-500/5',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl',
          tone === 'mint' ? 'bg-mint/20' : 'bg-amber-500/20',
        )}
      />
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          tone === 'mint' ? 'text-mint' : 'text-amber-500',
        )}
      >
        {rank}
      </p>
      <p className="mt-2 text-base font-semibold tracking-tight">
        Eligible for {campuses.length === 4 ? 'all four campuses' : `${campuses.length} campuses`}
      </p>
      <ul className="mt-3 space-y-1.5">
        {campuses.map((c) => (
          <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                tone === 'mint' ? 'bg-mint' : 'bg-amber-500',
              )}
            />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Insight({
  tone,
  headline,
  children,
}: {
  tone: 'coral' | 'mint' | 'amber';
  headline: string;
  children: React.ReactNode;
}) {
  const map = {
    coral: 'border-coral/30 bg-coral/5 text-coral',
    mint: 'border-mint/30 bg-mint/5 text-mint',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
  } as const;
  return (
    <div className={cn('rounded-xl border p-4', map[tone])}>
      <p className="text-xs font-semibold uppercase tracking-wider">{headline}</p>
      <p className="mt-2 text-sm leading-snug text-foreground">{children}</p>
    </div>
  );
}

function PatternCard({
  campus,
  tag,
  highlights,
}: {
  campus: string;
  tag: string;
  highlights: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-coral/10 blur-2xl" />
      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral">
          {tag}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">{campus}</h3>
        <ul className="mt-3 space-y-2">
          {highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
