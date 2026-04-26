"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight, Layers, Sparkles, Check } from "lucide-react";

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
    imageSrc: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/ui-vitranks.webp`,
    imageAlt:
      "VIT Ranks modern exam UI — dark theme, A/B/C/D buttons, per-subject palette",
    features: [
      "Works on laptop, tablet, and phone",
      "Minimal chrome, maximum reading space",
      "Per-subject palette with answered/marked colors",
    ],
    tint: "mint",
  },
  {
    key: "viteee",
    eyebrow: "VITEEE-CBT",
    title: "VITEEE-style",
    subtitle:
      "Mirrors the official VITEEE CBT interface so you walk into test day with muscle memory already in place.",
    imageSrc: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/images/vit-ui.webp`,
    imageAlt:
      "VITEEE-style CBT UI — section tabs, numbered palette, Save & Next",
    features: [
      "Section + subject tabs",
      "Mark for Review & Next, Clear Response, Save & Next",
      "Numbered question palette with 5-state legend",
    ],
    tint: "coral",
  },
];

const SPRING = { damping: 28, stiffness: 220 };

function TiltCard({ surface, index }: { surface: Surface; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, margin: "-60px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), SPRING);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), SPRING);
  const imgScale = useSpring(1, SPRING);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    imgScale.set(1.04);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
    imgScale.set(1);
  }

  const isMint = surface.tint === "mint";

  const accentVar = isMint ? "var(--mint)" : "var(--coral)";
  const tintCls = isMint ? "text-mint" : "text-coral";
  const chipCls = isMint
    ? "border-mint/40 bg-mint/10 text-mint"
    : "border-coral/40 bg-coral/10 text-coral";
  const dotCls = isMint ? "bg-mint" : "bg-coral";
  const shadowHover = isMint
    ? "group-hover:shadow-[0_24px_60px_-12px_hsl(158_72%_64%_/_0.22)]"
    : "group-hover:shadow-[0_24px_60px_-12px_hsl(8_92%_66%_/_0.22)]";
  const glowCls = isMint ? "from-mint/10" : "from-coral/10";

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 52 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.85,
        delay: index * 0.16,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1100 }}
      className="group"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* shimmer-border-hover wraps the tilt div so the border tilts with the card */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`shimmer-border-hover rounded-[1.35rem] transition-shadow duration-500 ${shadowHover}`}
      >
        <div className="relative overflow-hidden rounded-[1.25rem] border border-border/60 bg-card">
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 z-10 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, hsl(${accentVar}) 50%, transparent 100%)`,
            }}
          />

          {/* Ambient hover glow */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowCls} to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
          />

          <div className="relative p-5 md:p-6">
            {/* Chip row */}
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${chipCls}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dotCls}`} />
                {surface.eyebrow}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/35">
                0{index + 1}&thinsp;/&thinsp;02
              </span>
            </div>

            {/* Screenshot */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/50 bg-background">
              <motion.img
                src={surface.imageSrc}
                alt={surface.imageAlt}
                className="h-full w-full object-cover object-top"
                style={{ scale: imgScale }}
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
            </div>

            {/* Copy */}
            <div className="mt-5">
              <h3 className="text-[1.55rem] font-semibold leading-tight tracking-tight">
                {surface.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {surface.subtitle}
              </p>

              <ul className="mt-4 space-y-2.5">
                {surface.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.16 + 0.38 + fi * 0.08,
                      ease: "easeOut",
                    }}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tintCls}`}
                    />
                    <span>{f}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DualUIShowcase() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section id="exam-ui" className="relative overflow-hidden py-24 md:py-32">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[30%] h-[38rem] w-[38rem] rounded-full bg-coral/[0.07] blur-[110px]" />
        <div className="absolute bottom-[20%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-mint/[0.07] blur-[110px]" />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.08]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div ref={headRef} className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Layers className="h-3.5 w-3.5" />
            Pick your interface
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-semibold leading-[0.95] tracking-tighter md:text-6xl"
          >
            Two UIs.{" "}
            <span className="font-display italic gradient-text">One</span>{" "}
            set of mocks.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            Practice in our modern interface, or switch to the VITEEE-faithful
            CBT for a realistic rehearsal. Same questions, same clock, same
            scoring &mdash; you just pick the skin.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {surfaces.map((s, i) => (
            <TiltCard key={s.key} surface={s} index={i} />
          ))}
        </div>

        {/* CTA */}
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
            Your choice is remembered &mdash; pick once and it&rsquo;s the
            default next time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
