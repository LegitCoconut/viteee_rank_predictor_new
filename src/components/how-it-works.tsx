"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Target,
  BookOpenCheck,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  Trophy,
  Timer,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    index: "01",
    icon: Target,
    kicker: "Pick your mode",
    title: "Choose a mock test.",
    body:
      "Grab a curated paper or spin up a fresh randomised test — MPCEA stream, real VITEEE pattern, 125 questions. No signup, nothing to install.",
    stat: "Random or curated · 125 Qs",
    gradient: "from-coral/40 via-peach/30 to-transparent",
  },
  {
    index: "02",
    icon: BookOpenCheck,
    kicker: "Practice like it's the real thing",
    title: "Take it under exam conditions.",
    body:
      "Timed 2h 30m clock, subject-wise navigation, mark-for-review, and a clean interface built to feel like the actual VITEEE CBT. Questions are sourced from free, publicly-available material.",
    stat: "2.5 hours · 4 subjects",
    gradient: "from-mint/40 via-sky/30 to-transparent",
  },
  {
    index: "03",
    icon: TrendingUp,
    kicker: "Find your weak spots",
    title: "Analyse. Compare. Improve.",
    body:
      "Instant per-subject breakdown, question-by-question review, and a live leaderboard that keeps every attempt honest. Come back tomorrow and beat yesterday.",
    stat: "Live leaderboard · rich analytics",
    gradient: "from-lavender/40 via-coral/20 to-transparent",
  },
];

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40">
        <div className="absolute left-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute right-[-10%] top-2/3 h-[26rem] w-[26rem] rounded-full bg-mint/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            How it works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]"
          >
            Three steps to{" "}
            <span className="font-display italic gradient-text">knowing</span>
            <br /> where you stand.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            From a rough score estimate to a data-backed college prediction — in
            the time it takes to pour a cup of chai.
          </motion.p>
        </div>

        <div ref={wrapRef} className="relative mx-auto max-w-5xl">
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-border md:left-1/2 md:block">
            <motion.div
              style={{ scaleY: lineScaleY, transformOrigin: "top" }}
              className="h-full w-full bg-gradient-to-b from-coral via-peach to-mint"
            />
          </div>

          <div className="space-y-16 md:space-y-28">
            {steps.map((step, i) => (
              <StepRow key={step.index} step={step} flip={i % 2 === 1} />
            ))}
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/mocktest"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
            >
              <Trophy className="h-4 w-4 text-coral" />
              Start your first mock — it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  flip,
}: {
  step: (typeof steps)[number];
  flip: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative grid gap-8 md:grid-cols-2 md:gap-16 ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="pointer-events-none absolute left-6 top-6 z-10 hidden -translate-x-1/2 md:left-1/2 md:block">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
          <span className="font-display text-base italic text-coral">
            {step.index}
          </span>
        </div>
      </div>

      <div className={`pl-14 md:pl-0 ${flip ? "md:pl-16 md:text-left" : "md:pr-16 md:text-right"}`}>
        <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Step {step.index} · {step.kicker}
        </p>
        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
          {step.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {step.body}
        </p>
        <div
          className={`mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground`}
        >
          <Timer className="h-3 w-3" />
          {step.stat}
        </div>
      </div>

      <div className={`pl-14 md:pl-0 ${flip ? "md:pr-16" : "md:pl-16"}`}>
        <motion.div
          whileHover={{ y: -6, rotateX: 2, rotateY: flip ? -2 : 2 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${step.gradient}`}
          />
          <div className="absolute inset-0 bg-grid-fine opacity-40" />
          <div className="absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 shadow-sm backdrop-blur">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-display text-5xl italic text-foreground/15">
                {step.index}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {step.kicker}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight">
                {step.title}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
