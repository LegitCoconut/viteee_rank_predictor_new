"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, BookOpenCheck, TrendingUp, Timer } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    index: "01",
    icon: Target,
    kicker: "Pick a paper",
    title: "Choose a mock test.",
    body:
      "Start with a curated paper or a fresh randomised one, both in the real VITEEE pattern. No signup, nothing to install.",
    stat: "100 questions · random or curated",
    gradient: "from-coral/40 via-peach/30 to-transparent",
  },
  {
    index: "02",
    icon: BookOpenCheck,
    kicker: "Sit it like the real exam",
    title: "Take it under exam conditions.",
    body:
      "Four sections, each on its own clock: Maths 50 minutes, Physics 30, Chemistry 30, Aptitude & English 10. Mark for review, Save & Next and the question palette work like the actual CBT.",
    stat: "2 hours · 4 timed sections",
    gradient: "from-mint/40 via-sky/30 to-transparent",
  },
  {
    index: "03",
    icon: TrendingUp,
    kicker: "See where you stand",
    title: "Review, then predict.",
    body:
      "Get a subject-wise breakdown and review every question. Compare your score on the live leaderboard, then enter your rank in the predictor to see which VIT campus and branch it could get you.",
    stat: "Analytics · leaderboard · rank predictor",
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
      className="relative py-14 md:py-32 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40">
        <div className="absolute left-[-10%] top-1/3 h-112 w-md rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute right-[-10%] top-2/3 h-104 w-104 rounded-full bg-mint/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-20">
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
            Take a full paper, see where you lose marks, then check which colleges
            your rank can reach.
          </motion.p>
        </div>

        <div ref={wrapRef} className="relative mx-auto max-w-5xl">
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-border md:left-1/2 md:block">
            <motion.div
              style={{ scaleY: lineScaleY, transformOrigin: "top" }}
              className="h-full w-full bg-linear-to-b from-coral via-peach to-mint"
            />
          </div>

          <div className="space-y-12 md:space-y-28">
            {steps.map((step, i) => (
              <StepRow key={step.index} step={step} flip={i % 2 === 1} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <Button size="lg" asChild>
              <Link href="/mocktest">Take your first mock, free</Link>
            </Button>
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
      className="relative grid gap-8 md:grid-cols-2 md:gap-16"
    >
      <div className="pointer-events-none absolute left-6 top-6 z-10 hidden -translate-x-1/2 md:left-1/2 md:block">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-xs">
          <span className="font-display text-base italic text-coral">
            {step.index}
          </span>
        </div>
      </div>

      <div className={`md:pl-0 ${flip ? "md:order-2 md:pl-16 md:text-left" : "md:pr-16 md:text-right"}`}>
        <p className="mb-2 text-sm font-medium text-coral">
          Step {Number(step.index)} · {step.kicker}
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

      <div className={`md:pl-0 ${flip ? "md:order-1 md:pr-16" : "md:pl-16"}`}>
        <motion.div
          whileHover={{ y: -6, rotateX: 2, rotateY: flip ? -2 : 2 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="group relative aspect-video overflow-hidden rounded-3xl md:aspect-4/3 border border-border bg-card shadow-lg"
        >
          <div
            className={`absolute inset-0 bg-linear-to-br ${step.gradient}`}
          />
          <div className="absolute inset-0 bg-grid-fine opacity-40" />
          <div className="absolute inset-0 bg-noise mix-blend-overlay" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 shadow-xs backdrop-blur-sm">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-display text-5xl italic text-foreground/15">
                {step.index}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
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
