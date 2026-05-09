"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Sparkles, MoveRight, Users, FileText, Clock, ArrowDown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const rotatingWords = ["exam-ready", "score", "speed", "confidence"];

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleNumber, setTitleNumber] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);
  const scaleContent = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const glowX = useTransform(smoothX, (v) => `${v * 100}%`);
  const glowY = useTransform(smoothY, (v) => `${v * 100}%`);

  useEffect(() => {
    const id = setInterval(() => {
      setTitleNumber((n) => (n + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width);
      mouseY.set((e.clientY - r.top) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const stats = useMemo(
    () => [
      { icon: FileText, value: "500", label: "Mock Questions", suffix: "+" },
      { icon: Clock, value: "2.5", label: "Hours per test", suffix: "h" },
      { icon: Users, value: "100", label: "% Free forever", suffix: "" },
    ],
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden hero-mesh isolate"
      style={{ minHeight: "100svh" }}
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full blur-3xl animate-blob-slow"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--coral) / 0.55), transparent 60%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full blur-3xl animate-blob"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--mint) / 0.45), transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full blur-3xl animate-blob-fast"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--lavender) / 0.45), transparent 60%)",
          }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none reveal-mask" />

      <motion.div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, hsl(var(--peach) / 0.18), transparent 55%)`,
        }}
      />

      <div className="absolute inset-0 bg-noise pointer-events-none mix-blend-overlay" />

      <motion.div
        style={{ y: yContent, opacity: opacityContent, scale: scaleContent }}
        className="relative z-10 container mx-auto px-4"
      >
        <div className="flex flex-col items-center justify-center gap-10 py-28 md:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href="https://malabarmatrix.site"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition hover:bg-white/10"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
              </span>
              A Malabar Matrix Initiative
              <MoveRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="max-w-5xl text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter text-white"
          >
            Build your{" "}
            <span className="relative inline-flex min-w-[5ch] justify-center align-baseline">
              {rotatingWords.map((w, i) => (
                <motion.span
                  key={w}
                  className="absolute font-display italic gradient-text whitespace-nowrap"
                  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                  animate={
                    titleNumber === i
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {
                          opacity: 0,
                          y: titleNumber > i ? -40 : 40,
                          filter: "blur(12px)",
                        }
                  }
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                >
                  {w}
                </motion.span>
              ))}
              <span className="invisible">{rotatingWords[0]}</span>
            </span>
            <br />
            <span className="text-white/95">for VITEEE 2026.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="max-w-2xl text-balance text-base md:text-xl leading-relaxed text-white/70"
          >
            Free, full-length VITEEE mock tests with instant analytics, a live
            leaderboard, and zero paywalls. Sharpen your score the way toppers
            do — one honest attempt at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              size="lg"
              asChild
              className="shimmer-border group h-12 gap-2 rounded-full bg-white px-7 text-base font-semibold text-plum-deep hover:bg-white/90"
            >
              <Link href="/mocktest">
                Take a mock test
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="group h-12 gap-2 rounded-full bg-gradient-to-r from-coral to-peach px-7 text-base font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach"
            >
              <Link href="/ranks">
                <Medal className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Predict your rank
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group h-12 gap-2 rounded-full border-white/20 bg-white/5 px-7 text-base font-medium text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
            >
              <Link href="/mocktest#leaderboard">
                View leaderboard
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
            className="mt-6 flex flex-wrap items-stretch justify-center gap-3 md:gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass flex items-center gap-3 rounded-2xl px-5 py-3 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/30 to-peach/30">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-display text-2xl italic leading-none text-white">
                    {s.value}
                    <span className="text-coral">{s.suffix}</span>
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-white/60">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}

export { Hero };
