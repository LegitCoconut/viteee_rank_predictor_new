"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";


// One random left-to-right or right-to-left crossing of the hero, in px.
function randomFlight() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ltr = Math.random() < 0.5;
  const n = 6;
  const x: number[] = [];
  const y: number[] = [];
  let cur = (0.1 + Math.random() * 0.6) * h;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    x.push((ltr ? t : 1 - t) * (w + 240) - 120);
    y.push(cur);
    cur = Math.min(0.8 * h, Math.max(0.06 * h, cur + (Math.random() - 0.5) * 0.3 * h));
  }
  // Nose follows the path; rtl flights are mirrored, so the angle uses |dx|.
  const rotate = x.map((_, i) => {
    const j = Math.min(i, n - 1);
    return (Math.atan2(y[j + 1] - y[j], Math.abs(x[j + 1] - x[j])) * 180) / Math.PI;
  });
  return { x, y, rotate, scaleX: ltr ? 1 : -1, duration: 14 + Math.random() * 14, delay: Math.random() * 5, id: Math.random() };
}

function PaperPlane({ size, still }: { size: number; still?: React.CSSProperties }) {
  const [flight, setFlight] = useState<ReturnType<typeof randomFlight> | null>(null);
  useEffect(() => {
    if (!still) setFlight(randomFlight());
  }, [still]);

  const body = (
    <>
      <span className="h-px bg-linear-to-r from-transparent to-white/80" style={{ width: size * 2.5 }} />
      <svg viewBox="0 0 24 24" width={size} height={size} className="drop-shadow-md">
        <path d="M23 12 2 4l5 8-5 8Z" fill="#fff" />
        <path d="M23 12H7l-5 8Z" fill="#c7d2fe" />
      </svg>
    </>
  );
  if (still) return <div className="absolute flex items-center" style={still}>{body}</div>;
  if (!flight) return null;
  return (
    <motion.div
      key={flight.id}
      className="absolute left-0 top-0 flex items-center"
      initial={{ x: flight.x[0], y: flight.y[0], rotate: flight.rotate[0], scaleX: flight.scaleX }}
      animate={{ x: flight.x, y: flight.y, rotate: flight.rotate }}
      transition={{ duration: flight.duration, delay: flight.delay, ease: "linear" }}
      onAnimationComplete={() => setFlight(randomFlight())}
    >
      {body}
    </motion.div>
  );
}

const cloud = (n: number, w: string, d: string, o = 1) =>
  ({ "--img": `url(/images/clouds/cloud-${n}.webp)`, "--w": w, "--d": d, "--o": o }) as React.CSSProperties;

// Backdrop for the whole homepage; the parent must be `relative isolate`.
// Gradient, stars and planes stay fixed; clouds scroll with the page so they
// frame the hero and then only peek in from the edges behind the content.
function Sky({ hero = false }: { hero?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <>
      <div className="sky pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="sky-stars absolute inset-0" />
        <PaperPlane size={26} still={reduce ? { left: "14%", top: "20%" } : undefined} />
        <PaperPlane size={20} still={reduce ? { left: "78%", top: "44%" } : undefined} />
        <PaperPlane size={15} still={reduce ? { left: "64%", top: "70%" } : undefined} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {hero && <div className="sky-hero" />}
        {hero && (
          <>
            {/* Hero: two clouds bracket the headline on the outer thirds, right one higher and larger. */}
            <div className="sky-cloud -left-28 top-[80svh] md:-left-[13vw] md:top-[28svh]" style={cloud(1, "max(22rem, 36vw)", "26s", 0.92)} />
            <div className="sky-cloud -right-20 top-[1svh] md:-right-[13vw] md:top-[13svh]" style={cloud(3, "max(24rem, 40vw)", "32s", 0.92)} />
          </>
        )}
        {(hero ? [20, 32, 44, 56, 68, 80, 91] : [8, 48, 86]).map((top, i) => (
          <div
            key={top}
            className={`sky-cloud ${i % 2 ? "left-0 -translate-x-2/3 md:-translate-x-1/2" : "right-0 translate-x-2/3 md:translate-x-1/2"}`}
            style={{ ...cloud((i % 3) + 1, "30rem", `${24 + i * 3}s`, 0.9), top: `${top}%` }}
          />
        ))}
      </div>
    </>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] w-full items-center text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 py-16 text-center">
          <motion.h1
            {...rise(0.06)}
            className="text-balance text-[clamp(2.5rem,7vw,5.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#f3ecff] [text-shadow:0_2px_24px_rgb(23_37_150/0.55)]"
          >
            Your VIT dream is closer than you think.
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg [text-shadow:0_1px_12px_rgb(23_37_150/0.6)] md:text-xl"
          >
            Full-length mock tests with per-section timers, a VIT rank and
            college predictor, and a live leaderboard. No signup, no paywall.
          </motion.p>

          <motion.div {...rise(0.18)} className="flex w-full max-w-xs flex-col items-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            <Button size="lg" asChild className="w-full bg-[#fdeef6] text-[#181121] hover:bg-white sm:w-auto">
              <Link href="/mocktest">Take a mock test</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="w-full bg-[#181121] text-[#f3ecff] hover:bg-[#181121]/85 sm:w-auto">
              <Link href="/ranks">Predict your rank</Link>
            </Button>
            <Button size="lg" asChild className="w-full border border-white/45 bg-white/15 text-white hover:bg-white/25 sm:w-auto">
              <Link href="/mocktest#leaderboard">View leaderboard</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export { Hero, Sky };
