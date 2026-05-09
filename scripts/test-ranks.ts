// Quick exploratory test for the ranks data layer.
// Run: npx tsx scripts/test-ranks.ts

import {
  COURSE_DATA,
  Campus,
  CourseData,
  Domain,
  getCoursesInRankRange,
  getEligibleCampuses,
} from '../src/lib/viteee-data';

interface Row {
  course: CourseData;
  category: number;
  closingRank: number;
}

interface Opts {
  campuses?: Campus[];
  domains?: Domain[];
  minCategory?: number;
}

const fmt = (n: number) => n.toLocaleString('en-IN');

function header(title: string) {
  console.log('\n' + '═'.repeat(70));
  console.log(' ' + title);
  console.log('═'.repeat(70));
}

function summarize(label: string, rows: Row[]) {
  const byDomain: Record<string, number> = {};
  const byCampus: Record<string, number> = {};
  const byCat: Record<string, number> = {};
  for (const r of rows) {
    byDomain[r.course.domain] = (byDomain[r.course.domain] ?? 0) + 1;
    byCampus[r.course.campus] = (byCampus[r.course.campus] ?? 0) + 1;
    byCat[String(r.category)] = (byCat[String(r.category)] ?? 0) + 1;
  }
  console.log(`\n  ${label}:  ${rows.length} rows`);
  console.log(`    by domain: ${JSON.stringify(byDomain)}`);
  console.log(`    by campus: ${JSON.stringify(byCampus)}`);
  console.log(`    by cat:    ${JSON.stringify(byCat)}`);
}

function securable(rank: number, opts: Opts = {}): Row[] {
  const eligible = getEligibleCampuses(rank);
  const activeCampuses = opts.campuses?.length ? opts.campuses : eligible;
  const activeDomains = opts.domains?.length ? new Set(opts.domains) : null;
  const minCat = opts.minCategory ?? 1;
  return COURSE_DATA.filter((c) => activeCampuses.includes(c.campus))
    .filter((c) => !activeDomains || activeDomains.has(c.domain))
    .flatMap((course) =>
      course.categories
        .map((closingRank, i) => ({ course, category: i + 1, closingRank }))
        .filter((x) => x.category >= minCat && rank <= x.closingRank),
    );
}

// ─── TEST 1: rank=5000, no filters ────────────────────────────────────────────
header('Rank 5000 · No filters');
{
  const rank = 5000;
  const counselling = getCoursesInRankRange(rank, 2500);
  const sec = securable(rank);
  summarize('counselling (±2500 window)', counselling);
  summarize('securable (rank ≤ closing for any cat)', sec);
  console.log('  ⚠ counselling MISSES easily-secured courses outside ±2500 window');
}

// ─── TEST 2: rank=5000, domains=[CS, Electronics] ─────────────────────────────
header('Rank 5000 · domains=[CS, Electronics]');
{
  const rank = 5000;
  const counselling = getCoursesInRankRange(rank, 2500, {
    domains: ['computer-science', 'electronics'],
  });
  const sec = securable(rank, { domains: ['computer-science', 'electronics'] });
  summarize('counselling', counselling);
  summarize('securable', sec);
}

// ─── TEST 3: rank=5000, campuses=[Vellore, Chennai], minCat=1 ─────────────────
header('Rank 5000 · campuses=[Vellore, Chennai] · minCategory=1');
{
  const rank = 5000;
  const counselling = getCoursesInRankRange(rank, 2500, {
    campuses: ['vellore', 'chennai'],
    minCategory: 1,
  });
  const sec = securable(rank, { campuses: ['vellore', 'chennai'], minCategory: 1 });
  summarize('counselling', counselling);
  summarize('securable', sec);
}

// ─── TEST 4: rank=5000, all 4 domains explicit (vs default) ───────────────────
header('Rank 5000 · domains=[ALL 4]  vs  domains=[]  (should be identical)');
{
  const rank = 5000;
  const a = getCoursesInRankRange(rank, 2500, {
    domains: ['computer-science', 'electronics', 'mechanical', 'core'],
  });
  const b = getCoursesInRankRange(rank, 2500);
  console.log(`  explicit-all: ${a.length}   default-empty: ${b.length}   match: ${a.length === b.length}`);
}

// ─── TEST 5: rank=5000, minCategory=3 ─────────────────────────────────────────
header('Rank 5000 · minCategory=3 (should only show Cat 3, 4, 5)');
{
  const rank = 5000;
  const counselling = getCoursesInRankRange(rank, 2500, { minCategory: 3 });
  const sec = securable(rank, { minCategory: 3 });
  summarize('counselling', counselling);
  summarize('securable', sec);
  const minCat = Math.min(...counselling.map((r) => r.category));
  console.log(`  lowest cat in counselling: ${minCat}  (expected ≥ 3)`);
}

// ─── TEST 6: rank=50000, all four campuses ────────────────────────────────────
header('Rank 50,000 · all eligible (Vellore, Chennai, AP, Bhopal)');
{
  const rank = 50000;
  const counselling = getCoursesInRankRange(rank, 2500);
  const sec = securable(rank);
  summarize('counselling', counselling);
  summarize('securable', sec);
}

// ─── TEST 7: rank=120000 (above 1L → only AP+Bhopal eligible) ─────────────────
header('Rank 1,20,000 · AP + Bhopal only by 2025 rule');
{
  const rank = 120000;
  console.log('  eligibleCampuses:', getEligibleCampuses(rank));
  const counselling = getCoursesInRankRange(rank, 2500);
  const sec = securable(rank);
  summarize('counselling', counselling);
  summarize('securable', sec);
}

// ─── TEST 8: rank=4343 from screenshot ────────────────────────────────────────
header('Rank 4,343 · domains=[CS, Electronics]  (matches screenshot)');
{
  const rank = 4343;
  const counselling = getCoursesInRankRange(rank, 2500, {
    domains: ['computer-science', 'electronics'],
  });
  const sec = securable(rank, { domains: ['computer-science', 'electronics'] });
  summarize('counselling', counselling);
  summarize('securable', sec);
  console.log('\n  Top 5 counselling rows:');
  counselling.slice(0, 5).forEach((r, i) =>
    console.log(`    ${i + 1}. ${r.course.shortName.padEnd(28)} ${r.course.campus.padEnd(8)} Cat ${r.category}  cutoff ${fmt(r.closingRank)}`),
  );
  console.log(`  electronics in counselling: ${counselling.filter((r) => r.course.domain === 'electronics').length}`);
  console.log(`  electronics in securable:   ${sec.filter((r) => r.course.domain === 'electronics').length}`);
}
