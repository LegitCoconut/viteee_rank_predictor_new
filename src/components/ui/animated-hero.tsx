"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS, TOTAL_MINUTES, TOTAL_QUESTIONS } from "@/lib/exam-pattern";
import Link from "next/link";

const stats = [
  { value: `${TOTAL_QUESTIONS}`, label: "Questions per paper" },
  { value: `${TOTAL_MINUTES / 60}h`, label: "Four timed sections" },
  { value: "Free", label: "No signup, ever" },
];

function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section className="hero-mesh relative isolate w-full">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 pb-20 pt-20 text-center md:pb-28 md:pt-28">
          <motion.div {...rise(0)}>
            <Link
              href="https://malabarmatrix.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              A Malabar Matrix initiative
              <ChevronRight className="h-3 w-3" />
            </Link>
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="text-balance text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[1.02] tracking-tight"
          >
            Practice the real{" "}
            <span className="gradient-text">VITEEE 2027</span> paper.
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Full-length mock tests with per-section timers, a VIT rank and
            college predictor, and a live leaderboard. No signup, no paywall.
          </motion.p>

          <motion.div {...rise(0.18)} className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/mocktest">Take a mock test</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/ranks">Predict your rank</Link>
            </Button>
            <Button size="lg" variant="link" asChild className="text-foreground">
              <Link href="/mocktest#leaderboard">
                View leaderboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Signature: the 2027 paper drawn to scale, one segment per timed section. */}
          <motion.div {...rise(0.26)} className="mt-6 w-full max-w-3xl text-left">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              The 2027 paper, to scale
            </p>
            <ol className="flex gap-1.5" aria-label="Sections of the VITEEE 2027 paper">
              {SECTIONS.map((s, i) => (
                <li key={s.key} style={{ flexGrow: s.minutes, flexBasis: 0 }} className="min-w-[4.5rem] sm:min-w-[6.5rem]">
                  <div
                    className={`h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-foreground/25"}`}
                    aria-hidden
                  />
                  <p className="mt-2 text-[13px] font-medium leading-tight sm:text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.questions} Qs<br className="sm:hidden" /><span className="hidden sm:inline"> &middot; </span>{s.minutes} min
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.dl
            {...rise(0.32)}
            className="mt-4 grid w-full max-w-3xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card"
          >
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-5 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</dd>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm" aria-hidden>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

export { Hero };
