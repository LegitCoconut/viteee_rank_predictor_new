"use client";

import { motion } from "framer-motion";
import { Quote } from 'lucide-react';

type Testimonial = {
  name: string;
  initials: string;
  quote: string;
  accent: "coral" | "mint" | "peach" | "lavender";
};

const testimonials: Testimonial[] = [
  {
    name: "Abhishek Ghosh",
    initials: "AG",
    quote:
      "The interface is good. Overall the website is a solid 10/10 and deserves more recognition.",
    accent: "coral",
  },
  {
    name: "Adithyan P",
    initials: "AP",
    quote:
      "Very useful for all the students who have been writing VITEEE.",
    accent: "mint",
  },
  {
    name: "Maverick",
    initials: "M",
    quote: "Good, very useful.",
    accent: "peach",
  },
  {
    name: "Suryansh Upadhyay",
    initials: "SU",
    quote: "Decent work.",
    accent: "lavender",
  },
];

const accentMap: Record<Testimonial["accent"], { glow: string; ring: string; text: string }> = {
  coral: {
    glow: "from-coral/25 via-coral/10 to-transparent",
    ring: "ring-coral/30",
    text: "text-coral",
  },
  mint: {
    glow: "from-mint/25 via-mint/10 to-transparent",
    ring: "ring-mint/30",
    text: "text-mint",
  },
  peach: {
    glow: "from-peach/30 via-peach/10 to-transparent",
    ring: "ring-peach/30",
    text: "text-peach",
  },
  lavender: {
    glow: "from-lavender/30 via-lavender/10 to-transparent",
    ring: "ring-lavender/30",
    text: "text-lavender",
  },
};

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-1/4 h-[30rem] w-[30rem] rounded-full bg-mint/10 blur-3xl" />
        <div className="absolute right-[-8%] bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.12]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]"
          >
            Real words from{" "}
            <span className="font-display italic gradient-text">real</span>{" "}
            aspirants.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Straight from the feedback inbox - unedited and (mostly)
            nicer to us than we deserve.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const accent = accentMap[t.accent];
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-xl"
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${accent.glow} blur-3xl`}
      />

      <Quote
        className={`h-6 w-6 ${accent.text} opacity-70`}
        aria-hidden="true"
      />

      <blockquote className="relative mt-4 flex-1 text-[15px] leading-relaxed text-foreground/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ${accent.ring} text-sm font-semibold tracking-wide`}
        >
          {t.initials}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight">
            {t.name}
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            VITEEE aspirant
          </div>
        </div>
      </figcaption>
    </motion.figure>
  );
}
