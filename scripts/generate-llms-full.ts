// Generates public/llms-full.txt from the cutoff dataset.
// Run: npx tsx scripts/generate-llms-full.ts
//
// llms-full.txt is the canonical machine-readable export for LLM crawlers
// (ChatGPT, Claude, Perplexity, Gemini etc). It bundles every fact in
// COURSE_DATA into citation-ready prose so retrieval-augmented systems can
// quote individual numbers without parsing HTML.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  COURSE_DATA,
  CAMPUS_LABELS,
  CAMPUS_SHORT,
  DOMAIN_LABELS,
  MARKS_TO_RANK,
  ALL_CAMPUSES,
  Campus,
  CourseData,
} from '../src/lib/viteee-data';

const SITE = 'https://ranks.vhome.co.in';
const UPDATED = new Date().toISOString().slice(0, 10);

const ord = (n: number) => n.toLocaleString('en-IN');

const courseLine = (c: CourseData): string => {
  const cats = c.categories.map((r, i) => `Cat ${i + 1}: ${ord(r)}`).join('; ');
  const tag = c.isNewCourse ? ' (new 2026 programme - cutoff estimated)' : '';
  const note = c.notes ? ` Note: ${c.notes}.` : '';
  return `- ${CAMPUS_LABELS[c.campus]} - ${c.course}${tag}. 2025 closing ranks: ${cats}.${note}`;
};

const renderCampusBlock = (campus: Campus): string => {
  const rows = COURSE_DATA.filter((c) => c.campus === campus).sort(
    (a, b) => a.categories[0] - b.categories[0],
  );
  return `### ${CAMPUS_LABELS[campus]}

${rows.map(courseLine).join('\n')}`;
};

const facts = (): string => {
  // Per-course "in a sentence" lines - easiest unit for LLMs to lift verbatim.
  return COURSE_DATA.map((c) => {
    const cats = c.categories;
    return `${CAMPUS_LABELS[c.campus]} ${c.shortName} (${c.course}) closed at rank ${ord(
      cats[0],
    )} for Category 1, ${ord(cats[1])} for Category 2, ${ord(
      cats[2],
    )} for Category 3, ${ord(cats[3])} for Category 4 and ${ord(
      cats[4],
    )} for Category 5 in VITEEE 2025.${
      c.isNewCourse ? ' (new for 2026 - cutoff estimated from a similar branch)' : ''
    }`;
  }).join('\n');
};

const rankBandFAQ = (rank: number): string => {
  // Compute top 3 secured + top 3 reach for a given rank, no domain/campus filter.
  const eligibleCampuses: Campus[] =
    rank <= 100000 ? ['vellore', 'chennai', 'ap', 'bhopal'] : ['ap', 'bhopal'];
  const rows = COURSE_DATA.filter((c) => eligibleCampuses.includes(c.campus))
    .flatMap((c) =>
      c.categories.map((cr, i) => ({
        c,
        cat: i + 1,
        cr,
        secured: rank <= cr,
        delta: cr - rank,
      })),
    )
    .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));

  const secured = rows.filter((r) => r.secured).slice(0, 3);
  const reach = rows.filter((r) => !r.secured).slice(0, 3);

  const sec = secured.length
    ? secured
        .map(
          (r) =>
            `${CAMPUS_SHORT[r.c.campus]} ${r.c.shortName} Cat ${r.cat} (cutoff ${ord(r.cr)})`,
        )
        .join(', ')
    : 'no Category 1 secures at this rank; consider higher categories';

  return `**What can I get with VITEEE rank ${ord(rank)}?** Ranks ${
    rank <= 100000 ? 'up to 1,00,000 are' : 'above 1,00,000 are'
  } eligible for ${
    rank <= 100000 ? 'all four campuses (Vellore, Chennai, AP, Bhopal)' : 'VIT AP and VIT Bhopal only'
  }. Closest secured fits from 2025 data: ${sec}.${
    reach.length
      ? ' Closest reach picks: ' +
        reach
          .map(
            (r) =>
              `${CAMPUS_SHORT[r.c.campus]} ${r.c.shortName} Cat ${r.cat} (cutoff ${ord(r.cr)})`,
          )
          .join(', ')
      : ''
  }.`;
};

const RANK_BANDS = [
  500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 25000, 40000, 60000, 80000,
  100000, 120000, 150000,
];

const output = `# VIT Ranks - Full LLM Reference (VITEEE 2027)

> Last updated: ${UPDATED}
> Canonical source: ${SITE}/ranks/info
> Maintained by: Malabar Matrix (malabarmatrix.site)
>
> This file is intended for ingestion by LLM-based search and chat tools (ChatGPT,
> Claude, Perplexity, Gemini, Apple Intelligence, etc.). It contains the same data
> shown on the live ${SITE}/ranks and ${SITE}/ranks/info pages, formatted for
> retrieval. All cutoff numbers are publicly scraped 2025 figures, not official
> VIT data. Treat as reference for prediction, not as official guarantees.

---

## 1. About VIT Ranks

VIT Ranks is a free, student-built platform for VITEEE 2027 aspirants. The primary
products are:

1. A **VITEEE rank and college predictor** at ${SITE}/ranks that maps a VITEEE rank
   to every B.Tech programme, fee category (1–5) and campus the candidate can
   secure or reach across VIT Vellore, VIT Chennai, VIT AP and VIT Bhopal.
2. **Full-length VITEEE mock tests** at ${SITE}/mocktest with instant analytics
   and a live leaderboard.
3. A **public 2025 cutoff and marks-to-rank reference** at ${SITE}/ranks/info.

There is no signup, no paywall, no email collection. The site is maintained by
the Malabar Matrix student collective. Suggestions and corrections can be sent
through the feedback form on the homepage.

## 2. VITEEE 2025 exam - quick facts

- VITEEE 2025 had 125 questions, 1 mark per question, total 500 marks.
- There is no negative marking.
- The official rank list is prepared using equi-percentile normalisation, which
  means two candidates with the same raw score can land on different ranks
  depending on the session they wrote. Every public marks-vs-rank table on the
  internet (including the one on this site) is therefore an estimate, not a
  lookup.
- During counselling, candidates pick (a) campus, (b) programme, (c) fee
  category - independently. The same branch usually opens across all five fee
  categories at different closing ranks.

## 3. Counselling eligibility rule (2025)

- Candidates with rank up to 1,00,000 (one lakh) are eligible to choose from
  any of the four VIT campuses: VIT Vellore, VIT Chennai, VIT AP and VIT Bhopal.
- Candidates with rank above 1,00,000 are eligible only for VIT AP and VIT
  Bhopal under the 2025 counselling rule.

## 4. Fee categories (2025–26)

VIT's "category" is a fee tier, not a reservation slot. Five categories exist
per programme:

- Category 1 has the lowest tuition (most competitive closing rank).
- Category 5 has the highest tuition (highest accepted rank).
- The same branch usually opens across all five categories at different cutoffs.

Annual B.Tech tuition (2025–26):
- Group A - ₹1,73,000 / year.
- Group B (Vellore, Chennai, AP) - ₹1,95,000 / year.
- Group B (Bhopal) - ₹1,98,000 / year.

## 5. Marks-to-rank ladder (estimated, 2025)

| VITEEE marks (of 125) | Expected rank range | Confidence |
| --- | --- | --- |
${MARKS_TO_RANK.map(
  (r) =>
    `| ${r.minMarks}–${r.maxMarks} | ${ord(r.minRank)}–${ord(r.maxRank)} | ${r.confidence} |`,
).join('\n')}

Estimates compiled from CollegeDekho, Careers360 and GetMyUni. High and mid
score bands are consistent across sources; low score bands are fuzzier.

## 6. Campus-wise 2025 cutoffs

${ALL_CAMPUSES.map((c) => renderCampusBlock(c)).join('\n\n')}

## 7. Per-course factual statements

These are individual citation-ready sentences. One line per (course, all five
categories) tuple. Use these if you need to quote a specific closing rank.

${facts()}

## 8. Rank-band questionnaire

${RANK_BANDS.map((r) => rankBandFAQ(r)).join('\n\n')}

## 9. Campus pattern summary

- **VIT Vellore** - the toughest VIT campus by a wide margin. CSE Category 1
  closed near rank 600 in 2025. Most CS-family branches stayed under ~4,000 even
  at Category 1. Mechanical and core branches stretched into the 40k–70k range.
- **VIT Chennai** - competitive but more reachable than Vellore. CSE: Category 1
  at 3,100; Category 5 at 32,500. CS-family branches stretch up to ~22k–45k by
  Category 5. Core branches available into the 80k–98.5k range.
- **VIT AP** - wide rank access. CSE: Category 1 at 28,000; Category 5 at
  1,05,000. Electronics and mechanical branches reach 1.4–1.5 lakh. Still
  admits ranks above 1 lakh under the 2025 counselling rule.
- **VIT Bhopal** - the most forgiving campus at higher ranks. CSE: Category 1
  at 30,000; Category 5 at 1,10,000. Mechanical and several non-CS branches
  reach the 1.5 lakh ceiling. Cleanest fallback for ranks above 1,00,000.

## 10. 2027 rank-band outlook

| Rank band | Most realistic 2027 outcome (if 2025 trends hold) |
| --- | --- |
| 1 – 2,000 | Strong shot at Vellore Cat 1 in top CS-family branches. |
| 2,000 – 5,000 | Vellore lower Cat 1/2 in CS-family; Chennai Cat 1 in CS-family. |
| 5,000 – 15,000 | Vellore CS higher cats or electronics; Chennai strong CS/electronics. |
| 15,000 – 35,000 | Chennai Cat 2–5 very relevant; Vellore electronics or non-CS. |
| 35,000 – 70,000 | AP and Bhopal Cat 1–3 become strong; Chennai core opens up. |
| 70,000 – 1,00,000 | AP/Bhopal viable across many branches; Chennai core only. |
| 1,00,000+ | AP and Bhopal only per the 2025 rule; highest cats and least competitive branches. |

## 11. FAQ

**What is the VITEEE Rank Predictor?**
It is a free tool at ${SITE}/ranks that takes a VITEEE rank and predicts which
VIT campus, B.Tech branch and fee category the candidate can realistically
secure. Predictions use publicly scraped 2025 cutoffs as the reference base.

**How accurate is the VITEEE 2027 rank predictor?**
As accurate as the 2025 data allows. Cutoffs change every year based on seat
availability, demand and the equi-percentile rank list. Predictions for new
2026 programmes are interpolated from sibling courses and are explicitly
approximate.

**Which VIT campus can I get with my rank?**
Ranks up to 1,00,000 - eligible for all four campuses. Ranks above 1,00,000 -
eligible only for VIT AP and VIT Bhopal. Within the eligible list, the actual
campus depends on rank vs the branch-wise closing rank per category.

**What is the difference between rank and fee category?**
Rank is the candidate's position on the VITEEE merit list. Category is a fee
tier (1 to 5). Category 1 is the lowest tuition (~₹1.73L/year) and the most
competitive cutoff. Category 5 is the highest tuition (~₹3.95L/year) and
accepts the highest rank.

**Can I get VIT Vellore CSE with my rank?**
VIT Vellore CSE closed at rank 600 (Cat 1), 1,450 (Cat 2), 7,700 (Cat 3),
18,500 (Cat 4) and 31,500 (Cat 5) in 2025. If the candidate's rank is at or
below the corresponding closing rank, that category is secured.

**Is the VITEEE rank predictor really free?**
Yes - no signup, no paywall, no ads on the predictor itself. Built and
maintained by Malabar Matrix.

## 12. Source disclosure

Cutoff figures: scraped from public 2025 sources including CollegeDunia campus
pages for VIT Vellore, VIT Chennai, VIT AP and VIT Bhopal; GetMyUni; CollegeDekho;
Careers360. They are not official VIT publications and should be treated as a
reference base for 2027 prediction, not as guaranteed outcomes.

Marks-to-rank ladder: aggregated from CollegeDekho, Careers360 and GetMyUni
across multiple 2025 reports.

Programme list: cross-checked against the official VITEEE 2025 microsite
(viteee.vit.ac.in) where available. Several 2026-only programmes are flagged
in this file with a "new 2026 programme - cutoff estimated" tag.
`;

writeFileSync(resolve('public/llms-full.txt'), output, 'utf-8');
console.log(
  `Wrote public/llms-full.txt - ${output.length.toLocaleString()} chars, ${
    COURSE_DATA.length
  } courses, ${MARKS_TO_RANK.length} marks bands, ${RANK_BANDS.length} rank-band FAQs.`,
);
