"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Monitor, Sparkles, Check } from "lucide-react";

type Surface = {
  key: "modern" | "viteee";
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
  tint: "mint" | "coral";
};

const surfaces: Surface[] = [
  {
    key: "modern",
    eyebrow: "Default",
    title: "Modern",
    subtitle:
      "Our own clean, dark take on the CBT — built for a laptop, a phone, whatever's in front of you.",
    imageSrc: "/ui-vitranks.webp",
    imageAlt: "VIT Ranks modern exam UI — dark theme, A/B/C/D buttons, per-subject palette",
    features: [
      "Works on laptop, tablet, and phone",
      "Minimal chrome, maximum reading space",
      "Per-subject palette with answered/marked colors",
    ],
    tint: "mint",
  },
  {
    key: "viteee",
    eyebrow: "VITEEE-faithful",
    title: "VITEEE-style",
    subtitle:
      "Mirrors the official VITEEE CBT interface so you walk into test day with muscle memory already in place.",
    imageSrc: "/vit-ui.webp",
    imageAlt: "VITEEE-style CBT UI — section tabs, numbered palette, Save & Next",
    features: [
      "Section + subject tabs",
      "Mark for Review & Next, Clear Response, Save & Next",
      "Numbered question palette with 5-state legend",
    ],
    tint: "coral",
  },
];

const tintStyles = {
  mint: {
    glow: "from-mint/25 via-mint/10 to-transparent",
    ring: "ring-mint/40",
    chip: "border-mint/40 bg-mint/10 text-mint",
    dot: "bg-mint",
  },
  coral: {
    glow: "from-coral/25 via-peach/10 to-transparent",
    ring: "ring-coral/40",
    chip: "border-coral/40 bg-coral/10 text-coral",
    dot: "bg-coral",
  },
};

export function DualUIShowcase() {
  return (
    <section
      id="exam-ui"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-1/4 h-[30rem] w-[30rem] rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-mint/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.12]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Layers className="h-3.5 w-3.5" />
            Pick your interface
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]"
          >
            Two UIs.{" "}
            <span className="font-display italic gradient-text">One</span>{" "}
            set of mocks.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Practice in our modern interface, or switch to the VITEEE-faithful
            CBT for a realistic rehearsal. Same questions, same clock, same
            scoring &mdash; you just pick the skin.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {surfaces.map((s, i) => (
            <SurfaceCard key={s.key} surface={s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <Link
            href="/mocktest"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
          >
            <Sparkles className="h-4 w-4 text-coral" />
            Start a mock and pick your UI
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Your choice is remembered &mdash; pick once and it&rsquo;s the default next time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SurfaceCard({ surface, index }: { surface: Surface; index: number }) {
  const tint = tintStyles[surface.tint];
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-xl md:p-6"
    >
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${tint.glow} blur-3xl`}
      />

      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${tint.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${tint.dot}`} />
          {surface.eyebrow}
        </span>
        <Monitor className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/60 bg-background">
        <img
          src={surface.imageSrc}
          alt={surface.imageAlt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
      </div>

      <div className="relative mt-5 flex-1">
        <h3 className="text-2xl font-semibold tracking-tight">
          {surface.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {surface.subtitle}
        </p>

        <ul className="mt-4 space-y-2">
          {surface.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <Check
                className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                  surface.tint === "mint" ? "text-mint" : "text-coral"
                }`}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
