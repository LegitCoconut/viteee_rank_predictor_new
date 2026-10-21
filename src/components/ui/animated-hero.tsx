"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS, TOTAL_MINUTES, TOTAL_QUESTIONS } from "@/lib/exam-pattern";
import Link from "next/link";


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
            <p className="mb-3 text-center text-sm text-muted-foreground">
              {TOTAL_QUESTIONS} questions in {TOTAL_MINUTES / 60} hours, in four timed sections
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {SECTIONS.map((s) => (
                <div key={s.key} style={{ flexGrow: s.minutes, flexBasis: 0 }} className="h-2 rounded-full bg-primary" />
              ))}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4" aria-label="Sections of the VITEEE 2027 paper">
              {SECTIONS.map((s) => (
                <li key={s.key}>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.questions} questions &middot; {s.minutes} min
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
