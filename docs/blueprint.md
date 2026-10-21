# **App Name**: VIT RANKS

A free, no-signup VITEEE mock-test platform for aspirants. Owned and
maintained by Malabar Matrix.

## Core Features

- **Full-length mock tests**: 125 questions, 2.5-hour timer, VITEEE exam
  pattern. Two modes - randomised paper (`/api/mocktest/questions`) or
  curated predefined sets (`/api/mocktest/predefined/:id/questions`).
- **VITEEE-style marking**: +4 for each correct answer, −1 for each wrong
  answer, 0 for unanswered. Applied across the test UI, results page,
  leaderboard ranking, past results, and detailed review.
- **Instant results & analytics**: score orb with animated gradient ring,
  section-wise marks breakdown, correct / wrong / unanswered / marked /
  visited tile grid.
- **Re-openable detailed review**: every submit caches a per-question
  snapshot to `localStorage.mockTestQuestions[examId]` (id, image URL,
  correct option, subject) alongside the answer log in
  `mockTestResults`. Past attempts stay reopenable question-by-question
  via `/mocktest/results/detailed?examId=…` - no refetching, no re-take.
- **Live leaderboard**: Redis-backed top-10 by marks-percentage, deduped
  by student name. Fed by `/api/mocktest/submit` → `/api/mocktest/leaderboard`.
- **Past Results dashboard**: on-device history with section-wise bars,
  re-open + delete actions per attempt, bulk clear.
- **Syllabus & exam pattern**: full VITEEE syllabus with downloadable
  PDFs and an illustrated pattern breakdown.
- **Important dates timeline**: scroll-linked gradient progress rail for
  VITEEE 2027 milestones.
- **Feedback form**: Turnstile-protected form with optional
  update-email subscription (stored in Mongo, used only for product
  announcements - see terms).
- **No signup, no auth**: the only identifier is the name you enter at
  test setup, stored locally and used purely for the leaderboard.

## Design Language - Playful-Premium

Dark-first, editorial typography, animated gradient mesh, scroll-linked
parallax. Built for mid-range Android phones first, scales up to
laptops/tablets.

### Palette

CSS custom properties live in [src/app/globals.css](../src/app/globals.css).
The site is **dark-only** - tokens live on `:root` directly, and
[src/app/layout.tsx](../src/app/layout.tsx) hardcodes `className="dark"`
on `<html>` so Tailwind `dark:` variants and third-party components that
gate on the `.dark` class still behave.

| Token | HSL | Hex-ish | Role |
| --- | --- | --- | --- |
| `--plum-deep` | `258 50% 6%` | `#07030f` | Base canvas (hero, banners) |
| `--plum` | `260 45% 12%` | `#0f0722` | Card surface in dark |
| `--coral` | `8 92% 66%` | `#f17461` | Primary accent, "live" dot, CTAs |
| `--peach` | `28 95% 70%` | `#ffa764` | Gradient partner to coral |
| `--mint` | `158 72% 64%` | `#63e6b3` | Success / correct verdicts |
| `--sky` | `210 95% 68%` | `#5fb1f7` | Data / info accents |
| `--lavender` | `272 80% 82%` | `#d1a5f2` | Soft highlights |

The signature shimmer gradient used on display type, CTA borders, and
progress rails is `linear-gradient(110deg, coral → peach → lavender → mint)`.

### Typography

| Family | Role | Weights |
| --- | --- | --- |
| **Instrument Serif** (italic) | Display - "wow" words, score numerals, numbered kickers | 400 italic |
| **Space Grotesk** | Section headlines (fallback for display) | 300–700 |
| **Inter** | Body, form, UI chrome | 400–800 |

Declared via `next/font`-style `<link>` in [src/app/layout.tsx](../src/app/layout.tsx).
Exposed to Tailwind as `font-display`, `font-headline`, `font-body`
(see [tailwind.config.ts](../tailwind.config.ts)).

### Motion & Effects

Framer Motion drives everything interactive:

- **Hero parallax**: layered gradient orbs translate on scroll, cursor-
  reactive spotlight via `useMotionTemplate`, noise texture over a
  subtle grid.
- **Rotating italic display word**: blur-in / blur-out spring transitions.
- **Scroll-linked progress rails**: `useScroll` + `useTransform` for the
  timeline and "How It Works" vertical line.
- **3-D tilt cards**: spring-interpolated `rotateX` / `rotateY` on mouse-
  move - used by campus showcase patterns (reusable).
- **Reveal animations**: `whileInView` with `margin: '-80px'` for section
  entries.
- **Animated score ring** on results: SVG `strokeDashoffset` bound to a
  `useSpring`, counting up with the marks value.
- **Conic shimmer border** (`.shimmer-border`): CSS `@property --angle`
  animation for the primary CTA and key cards.
- **`prefers-reduced-motion`** kills the floating orbs, shimmer, and
  gradient text animation.

### Components & Patterns

- **Icons**: Lucide React. One-icon-per-intent rule - e.g., `CheckCircle2`
  for correct, `XCircle` for wrong, `MinusCircle` for unanswered,
  `Trophy` for leaderboard, `HardDrive` for on-device storage.
- **Cards**: rounded-2xl / rounded-3xl with `border-border/60`, hover-
  revealed blob glow on the edge.
- **Glass surfaces**: `.glass` utility for translucent stats chips over
  the hero mesh.
- **Grid overlays**: `.bg-grid` (64px) and `.bg-grid-fine` (32px) with
  mask-fade on the edges.
- **Buttons**: rounded-full. Primary CTAs use the coral→peach gradient
  on light surfaces and solid white on the dark hero.

## Architecture

### Routes
- `/` - landing (hero, How it works, important dates, feedback)
- `/mocktest` - launch screen (curated tests, random, syllabus, pattern,
  past results, leaderboard)
- `/mocktest/setup` - name / stream / consent gate (Turnstile + optional
  email subscribe)
- `/mocktest/start` - the live test UI (untouched by recent redesigns
  to avoid destabilising the exam experience)
- `/mocktest/results` - score orb, grade, breakdown tiles, subject-wise
  marks bars
- `/mocktest/results/detailed?examId=<id>` - question-by-question grid
  (1 / 2 / 3 columns based on viewport), filter chips, verdict rails
- `/terms` - plain-language terms including the local-storage disclosure
  and marking scheme

### Data flow
- **Mongo** (`test-results` collection) - authoritative attempt log.
- **Upstash Redis** (`mocktest:leaderboard`) - sorted set keyed by marks-
  percentage, widened to 50-entry headroom to survive name-dedup without
  shrinking below display count. Flush via `npm run flush:leaderboard -- --yes`.
- **localStorage**:
  - `mockTestResults[]` - per-attempt summary (answers, marks, sections).
  - `mockTestQuestions[examId]` - per-attempt question snapshot (id,
    imageUrl, correct_option, subject). Quota-safe; orphan-pruned on
    `QuotaExceededError`.
  - `mockTestSubscribed` - flag to hide the subscribe checkbox after
    first opt-in.
- **sessionStorage**:
  - `mockTestSetup` - hand-off from setup → start.
  - `latestResult` / `latestQuestions` - immediate post-submit redirect
    payload for `/mocktest/results` and `/mocktest/results/detailed`.

### SEO
- Route-scoped `Metadata` exports in `layout.tsx` / `page.tsx` /
  `mocktest/layout.tsx` - keywords curated from real search-console data.
- Structured data via [src/components/json-ld.tsx](../src/components/json-ld.tsx):
  `WebSite`, `Organization`, `FAQPage` (incl. negative-marking Q&A),
  `Course`, `BreadcrumbList`.
- Analytics: Google Analytics (`G-LKRW6B6ZH0`) + Microsoft Clarity
  (`wd7k5hym2x`) + Vercel Analytics & Speed Insights - all in
  `layout.tsx`.

## Principles

- **No signup, ever.** Every feature must work for an anonymous student
  behind a shaky campus Wi-Fi.
- **On-device by default.** Test history, progress, and detailed review
  live in the browser. We never depend on having read access back to
  our own storage.
- **Exam-accurate first, pretty second.** The test UI is locked - it
  mimics the VITEEE CBT interface intentionally. Redesigns apply to
  marketing / setup / results pages only.
- **Honest marks.** Mock scores use stricter +4/−1 than the real exam so
  students build attempt discipline, not false confidence.
- **Mobile-first copy and motion budget.** Parallax on hero is fine;
  every section gates heavy effects on `prefers-reduced-motion`.
