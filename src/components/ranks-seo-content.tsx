'use client';

import Link from 'next/link';
import { BarChart3, CheckCircle2, ChevronRight, GraduationCap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COURSE_DATA, CAMPUS_SHORT, Campus } from '@/lib/viteee-data';

// SEO copy specifically targeted at the high-impression queries from search
// console: "viteee rank predictor", "vit college predictor", "vit rank",
// "vit branch predictor", "viteee category cutoff", etc. Renders below the
// rank-input hero so the page always ships keyword-rich body content in SSR.

const STEPS = [
  {
    n: '01',
    title: 'Enter your VITEEE rank',
    body:
      'Type the rank you received (or expect to receive) on the VITEEE 2027 scorecard. Valid ranks range from 1 to 2,00,000.',
  },
  {
    n: '02',
    title: 'Pick analysis or counselling',
    body:
      'Analysis shows your estimated marks, eligible campuses, and a domain-wise breakdown. Counselling generates a sortable, exportable list of every course you can secure or reach.',
  },
  {
    n: '03',
    title: 'Set your preferences',
    body:
      'Filter by branch family (CS, Electronics, Mechanical, Core), minimum fee category (1 to 5), and the VIT campuses you actually care about - Vellore, Chennai, AP or Bhopal.',
  },
  {
    n: '04',
    title: 'Reorder, share, download',
    body:
      'Drag rows to build your own preference order, copy the URL to share with friends, and download a clean PDF with a QR that regenerates the same view.',
  },
];

const CAMPUSES = [
  {
    name: 'VIT Vellore',
    tag: 'Toughest by a wide margin',
    accent: 'coral' as const,
    bullets: [
      'CSE Cat 1 closed near 600 in 2025.',
      'Most CS-family branches under ~4,000 even at Cat 1.',
      'Mechanical and core branches stretch into the 40k–70k bracket.',
    ],
  },
  {
    name: 'VIT Chennai',
    tag: 'Competitive but reachable',
    accent: 'mint' as const,
    bullets: [
      'CSE: Cat 1 at 3,100 → Cat 5 at 32,500.',
      'CS-family stretches up to ~22k–45k by Cat 5.',
      'Core branches available into the 80k–98.5k range.',
    ],
  },
  {
    name: 'VIT AP',
    tag: 'Wide rank access',
    accent: 'lavender' as const,
    bullets: [
      'CSE: Cat 1 at 28k → Cat 5 at 1,05,000.',
      'Electronics and mech branches reach 1.4–1.5 lakh.',
      'Still admits ranks above 1 lakh per the 2025 counselling rule.',
    ],
  },
  {
    name: 'VIT Bhopal',
    tag: 'Most forgiving at higher ranks',
    accent: 'sky' as const,
    bullets: [
      'CSE: Cat 1 at 30k → Cat 5 at 1,10,000.',
      'Mech and several non-CS branches reach the 1.5 lakh ceiling.',
      'Cleanest fallback for ranks above 1,00,000.',
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is the VITEEE Rank Predictor?',
    a: 'It is a free tool that takes your VITEEE rank and predicts which VIT campus (Vellore, Chennai, AP, Bhopal), B.Tech branch, and fee category you can realistically secure. The predictions use publicly scraped 2025 cutoff data as the reference base - not official VIT figures.',
  },
  {
    q: 'How accurate is the VITEEE 2027 rank predictor?',
    a: 'It is as accurate as the 2025 data allows. Cutoffs change every year based on seat availability, demand and the equi-percentile rank list, so treat every prediction as an informed estimate. Cutoffs we mark with a "New" badge are interpolated from sibling courses and are explicitly approximate.',
  },
  {
    q: 'Which VIT campus can I get with my VITEEE rank?',
    a: 'Ranks up to 1,00,000 are eligible for all four campuses (Vellore, Chennai, AP, Bhopal). Ranks above 1,00,000 are only eligible for VIT AP and VIT Bhopal under the 2025 counselling rule. Within the eligible list, your campus depends on rank vs the branch-wise closing rank per fee category.',
  },
  {
    q: 'What is the difference between VIT rank and fee category?',
    a: 'Rank is your position on the VITEEE merit list. Category is a fee tier (1 to 5) - Category 1 is the lowest tuition (about Rs.1.73L per year) and Category 5 is the highest (about Rs.3.95L per year). The same branch usually opens across all five categories at different closing ranks. Lower-numbered categories are more competitive because they cost less.',
  },
  {
    q: 'How are VITEEE ranks generated?',
    a: 'VITEEE 2025 used equi-percentile normalisation - every raw mark is converted to a percentile, and the rank list is built from those percentiles. As a result, two students with the same raw score can land on different ranks depending on the session they wrote, so any marks-to-rank table on the internet (including ours) is an estimate.',
  },
  {
    q: 'When are the official VIT 2027 cutoffs released?',
    a: 'Official campus-wise cutoffs are published by VIT after counselling rounds complete. Until then, this predictor uses the most recent (2025) closing ranks as the reference base. We update the dataset whenever VIT publishes new programme lists or revised cutoffs.',
  },
  {
    q: 'Can I get VIT Vellore CSE with my rank?',
    a: 'In 2025, VIT Vellore CSE closed at rank 600 (Cat 1), 1,450 (Cat 2), 7,700 (Cat 3), 18,500 (Cat 4) and 31,500 (Cat 5). If your rank is at or below the corresponding closing rank, that category is secured. Use the predictor to see the same calculation for every CS-family branch, including AI/ML, Cyber Security, Data Science and IT.',
  },
  {
    q: 'Is this VIT rank predictor really free?',
    a: 'Yes - no signup, no paywall, no ads on the predictor itself. It is built and maintained by students at Malabar Matrix for VITEEE aspirants. The same goes for the VITEEE mock tests on the site.',
  },
  {
    q: 'Can I share my counselling list with someone?',
    a: 'Every change you make - rank, filters, even custom row order - is encoded into the URL. Copy the link or download the PDF: both contain a QR code that regenerates the exact same view when scanned. Useful for sharing with parents, mentors or seniors.',
  },
];

// Programmatic "What can I get with VITEEE rank N?" entries computed off
// COURSE_DATA so every common rank band has a literal answer in the page HTML
// (good for both AI retrieval and "People also ask" style snippets).
const RANK_BANDS = [
  1000, 2500, 5000, 10000, 20000, 35000, 60000, 90000, 120000,
];

function topMatches(rank: number, n = 3) {
  const eligible: Campus[] =
    rank <= 100000 ? ['vellore', 'chennai', 'ap', 'bhopal'] : ['ap', 'bhopal'];
  const rows = COURSE_DATA.filter((c) => eligible.includes(c.campus))
    .flatMap((c) =>
      c.categories.map((cr, i) => ({
        course: c,
        cat: i + 1,
        cr,
        secured: rank <= cr,
        delta: cr - rank,
      })),
    )
    .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
  return {
    secured: rows.filter((r) => r.secured).slice(0, n),
    reach: rows.filter((r) => !r.secured).slice(0, n),
  };
}

function rankBandAnswer(rank: number): string {
  const { secured, reach } = topMatches(rank);
  const eligibilityNote =
    rank <= 100000
      ? 'Ranks up to 1,00,000 are eligible for all four VIT campuses (Vellore, Chennai, AP, Bhopal).'
      : 'Ranks above 1,00,000 are eligible only for VIT AP and VIT Bhopal per the 2025 counselling rule.';
  const fmt = (r: { course: { shortName: string; campus: Campus }; cat: number; cr: number }) =>
    `${CAMPUS_SHORT[r.course.campus]} ${r.course.shortName} Cat ${r.cat} (cutoff ${r.cr.toLocaleString('en-IN')})`;
  const securedLine = secured.length
    ? `Closest secured fits from 2025 data: ${secured.map(fmt).join(', ')}.`
    : 'No Category 1 secures at this rank - try higher fee categories.';
  const reachLine = reach.length ? ` Reach picks: ${reach.map(fmt).join(', ')}.` : '';
  return `${eligibilityNote} ${securedLine}${reachLine}`;
}

const RANK_FAQ = RANK_BANDS.map((rank) => ({
  q: `What can I get with VITEEE rank ${rank.toLocaleString('en-IN')}?`,
  a: rankBandAnswer(rank),
}));

const ALL_FAQ = [...FAQ, ...RANK_FAQ];

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ALL_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
});

export function RanksSeoContent() {
  return (
    <>
      {/* FAQ JSON-LD for rich snippets. React renders children of <script>
          tags as raw script content. */}
      <script type="application/ld+json">{faqJsonLd}</script>

      <section className="border-t border-border/40 bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-5xl space-y-20 px-4 md:space-y-24">
          {/* About */}
          <div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Free VITEEE 2027 rank &amp;{' '}
              <span className="font-display italic text-coral">college predictor</span>
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              VIT Ranks is a free <strong className="text-foreground">VITEEE rank predictor</strong>{' '}
              and <strong className="text-foreground">VIT college predictor</strong> for 2027
              admissions. Enter the rank you received on your VITEEE scorecard and the tool maps
              it to every B.Tech programme, fee category and campus you can realistically secure
              across <strong className="text-foreground">VIT Vellore, VIT Chennai, VIT AP</strong>{' '}
              and <strong className="text-foreground">VIT Bhopal</strong> - based on publicly
              available 2025 closing ranks.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Unlike most VIT rank predictor tools, this one also lets you drag-to-reorder your
              counselling list, export a clean PDF report with your rank and chosen preferences,
              and share a single link that regenerates the exact same table for anyone who opens
              it. No signup, no paywall, no email collection.
            </p>
          </div>

          {/* How it works */}
          <div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Use the VIT rank &amp; branch predictor in four steps
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-2xl border border-border/40 bg-card/60 p-5 transition-colors hover:border-coral/40"
                >
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-coral">
                    Step {s.n}
                  </span>
                  <h3 className="mt-3 text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus quick guide */}
          <div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Which VIT campus can your VITEEE rank get?
            </h2>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground">
              All four VIT campuses admit B.Tech students through VITEEE 2027, but the cutoff
              ranges differ sharply. Ranks up to 1,00,000 are eligible for all four campuses;
              above that, only VIT AP and VIT Bhopal admit students. Here is the 2025 snapshot.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {CAMPUSES.map((c) => (
                <CampusCard key={c.name} {...c} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/ranks/info#cutoffs"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-coral hover:text-coral/80"
              >
                See every branch &amp; category cutoff
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Fee categories */}
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Understanding VIT fee categories
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                VIT&apos;s &ldquo;category&rdquo; is a <strong className="text-foreground">fee
                tier</strong>, not a reservation slot. Every branch opens across five categories
                with the same syllabus and degree - the only thing that changes is the annual
                tuition and the closing rank.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  <span>
                    <strong className="text-foreground">Category 1</strong> - lowest tuition
                    (~₹1.73L/year), most competitive cutoffs.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  <span>
                    <strong className="text-foreground">Category 5</strong> - highest tuition
                    (~₹3.95L/year), highest accepted ranks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  <span>
                    No global rule like &ldquo;rank 1–20k → Cat 1&rdquo;. Category cutoffs depend
                    on campus, branch demand and seat availability that year.
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/60 p-6">
              <div className="grid grid-cols-5 gap-1 text-center">
                {[1, 2, 3, 4, 5].map((cat) => (
                  <div
                    key={cat}
                    className="rounded-md border border-border/30 bg-background/40 p-3"
                  >
                    <div className="font-mono text-xs text-muted-foreground">CAT</div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">{cat}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <RowFact label="Annual tuition (Group A)" value="₹1,73,000" />
                <RowFact label="Annual tuition (Group B)" value="₹1,95,000" />
                <RowFact label="Annual tuition (Bhopal)" value="₹1,98,000" />
                <RowFact label="Rank → all 4 campuses" value="≤ 1,00,000" />
                <RowFact label="Rank → AP & Bhopal only" value="> 1,00,000" />
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              VITEEE 2027 rank predictor - FAQ
            </h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-border/40 bg-card/60 p-5 transition-colors hover:border-coral/40 open:border-coral/40"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <h3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
                      {item.q}
                    </h3>
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 text-coral transition-transform group-open:rotate-45">
                      <span className="text-xl leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Rank-band specific answers - computed from COURSE_DATA so each
              "What can I get with rank N" query has a literal answer in HTML. */}
          <div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What can I get with my VITEEE rank?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Quick reference answers computed off the 2025 dataset. For your exact
              rank, use the predictor above - these are the most-searched bands.
            </p>
            <div className="mt-8 space-y-3">
              {RANK_FAQ.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-border/40 bg-card/60 p-5 transition-colors hover:border-coral/40 open:border-coral/40"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <h3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
                      {item.q}
                    </h3>
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 text-coral transition-transform group-open:rotate-45">
                      <span className="text-xl leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Internal nav */}
          <div className="rounded-3xl border border-coral/20 bg-gradient-to-br from-coral/10 via-transparent to-mint/10 p-8 md:p-12">
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Explore the rest of VIT Ranks
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              The predictor pairs with a free mock test platform, complete syllabus, and the full
              public dataset behind every prediction.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <NavCard
                href="/ranks/info"
                icon={BarChart3}
                title="The data behind it"
                body="Full 2025 cutoff tables, marks-to-rank ladder, counselling eligibility and exam pattern - laid out section by section."
                cta="Read the data"
              />
              <NavCard
                href="/mocktest"
                icon={GraduationCap}
                title="Free VITEEE mock tests"
                body="Full-length 2027-pattern mock tests with instant analytics and a live leaderboard. No signup."
                cta="Take a mock"
              />
              <NavCard
                href="/mocktest#leaderboard"
                icon={TrendingUp}
                title="Live leaderboard"
                body="See how your mock test scores stack up against every other VITEEE aspirant on the platform."
                cta="View ranks"
              />
            </div>
          </div>

          {/* Closing disclaimer */}
          <p className="text-center text-xs text-muted-foreground">
            VIT Ranks is an independent, student-built tool. We are not affiliated with Vellore
            Institute of Technology. All cutoff data shown here was scraped from public sources
            and is provided for informational use only.
          </p>
        </div>
      </section>
    </>
  );
}

function CampusCard({
  name,
  tag,
  accent,
  bullets,
}: {
  name: string;
  tag: string;
  accent: 'coral' | 'mint' | 'lavender' | 'sky';
  bullets: string[];
}) {
  const accentBg: Record<string, string> = {
    coral: 'bg-coral/10 border-coral/20',
    mint: 'bg-mint/10 border-mint/20',
    lavender: 'bg-lavender/10 border-lavender/20',
    sky: 'bg-sky/10 border-sky/20',
  };
  const dot: Record<string, string> = {
    coral: 'bg-coral',
    mint: 'bg-mint',
    lavender: 'bg-lavender',
    sky: 'bg-sky',
  };
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card/60 p-6',
        accentBg[accent] ?? 'border-border/40',
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-coral">{tag}</p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">{name}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span
              className={cn('mt-1.5 h-1 w-1 shrink-0 rounded-full', dot[accent] ?? 'bg-foreground')}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RowFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 pb-2 last:border-none last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function NavCard({
  href,
  icon: Icon,
  title,
  body,
  cta,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border/40 bg-background/60 p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-lg hover:shadow-coral/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-peach/20">
        <Icon className="h-5 w-5 text-coral" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-coral">
        {cta}
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
