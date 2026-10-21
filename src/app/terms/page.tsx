'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Globe, Mail, BookOpen, Trophy, Lock, Info, HardDrive } from 'lucide-react';

const SECTION_TONES = {
  coral: 'text-coral bg-coral/10 border-coral/20',
  mint: 'text-mint bg-mint/10 border-mint/20',
  peach: 'text-peach bg-peach/10 border-peach/20',
  sky: 'text-sky bg-sky/10 border-sky/20',
  lavender: 'text-lavender bg-lavender/10 border-lavender/20',
};

function Section({
  num,
  icon: Icon,
  title,
  tone,
  index,
  children,
}: {
  num: string;
  icon: React.ElementType;
  title: string;
  tone: keyof typeof SECTION_TONES;
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 transition-colors duration-300 hover:border-border/80 hover:bg-card/80 md:p-8"
    >
      {/* Decorative number */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-5 select-none font-mono text-[5rem] font-bold leading-none text-foreground/[0.04] transition-all duration-500 group-hover:text-foreground/[0.07]"
      >
        {num}
      </div>

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div
          className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${SECTION_TONES[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/40">
              {num}
            </span>
            <span className="h-px flex-1 bg-border/40" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <div className="mt-3 space-y-3 text-[0.925rem] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TermsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-mesh relative isolate overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="animate-blob-slow absolute -top-24 left-1/4 h-[30rem] w-[30rem] rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, hsl(var(--coral) / 0.4), transparent 60%)',
              }}
            />
            <div
              className="animate-blob absolute bottom-0 right-1/3 h-[24rem] w-[24rem] rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, hsl(var(--lavender) / 0.28), transparent 60%)',
              }}
            />
          </div>
          <div className="reveal-mask pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
          <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

          <div ref={heroRef} className="container relative z-10 mx-auto max-w-4xl px-4">

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[0.9] tracking-tighter text-white"
            >
              Terms &amp;{' '}
              <span className="font-display italic gradient-text">
                Conditions.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-base text-white/70 md:text-lg"
            >
              A clear, no-jargon overview of the team behind this platform, the
              origins of our content, and how we responsibly manage the little
              information you provide.
            </motion.p>
          </div>
        </section>

        {/* Sections */}
        <section className="container mx-auto max-w-3xl px-4 py-16 pb-24 md:py-20">
          <div className="space-y-4">
            <Section num="01" icon={Globe} title="About the Website" tone="coral" index={0}>
              <p>
                VIT RANKS is owned and managed by{' '}
                <Link
                  href="https://malabarmatrix.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral underline underline-offset-4 transition-colors hover:text-coral/80"
                >
                  Malabar Matrix
                </Link>
                . We build free, no-signup tools to help VITEEE aspirants
                prepare with confidence. For any queries, feedback, or concerns,
                you can reach us at{' '}
                <a
                  href="mailto:vitranks@malabarmatrix.in"
                  className="inline-flex items-center gap-1 text-coral underline underline-offset-4 transition-colors hover:text-coral/80"
                >
                  <Mail className="h-3.5 w-3.5" />
                  vitranks@malabarmatrix.in
                </a>
                .
              </p>
            </Section>

            <Section num="02" icon={BookOpen} title="Question Sources" tone="mint" index={1}>
              <p>
                All mock test questions on this platform are sourced from{' '}
                <span className="font-medium text-foreground">
                  free and publicly available material on the internet
                </span>{' '}
                - including sample papers, previous-year question sets, and open
                educational resources. We do not claim ownership of the
                underlying question content. If you are a rights holder and
                believe any content should be removed, please email us and we
                will act promptly.
              </p>
            </Section>

            <Section num="03" icon={Trophy} title="Name &amp; Leaderboard" tone="peach" index={2}>
              <p>
                When you start a mock test, we ask for a name. This name is used
                solely to display your score on the public{' '}
                <Link
                  href="/mocktest#leaderboard"
                  className="text-peach underline underline-offset-4 transition-colors hover:text-peach/80"
                >
                  leaderboard
                </Link>
                . Please avoid entering sensitive information - you can use a
                nickname or initials if you prefer.
              </p>
            </Section>

            <Section num="04" icon={HardDrive} title="Local Storage &amp; Detailed Analysis" tone="sky" index={3}>
              <p>
                So you can revisit any attempt later and review it question by
                question, we save the full details of each mock test to your{' '}
                <span className="font-medium text-foreground">
                  browser&rsquo;s local storage
                </span>{' '}
                right after you submit. This includes your final marks &amp;
                section-wise breakdown, the option you picked for every question
                (answered, skipped, or marked for review), the correct answer,
                and the question image reference used to render the detailed
                view.
              </p>
              <p>
                This data stays{' '}
                <span className="font-medium text-foreground">
                  entirely on your device
                </span>{' '}
                - we don&rsquo;t read it from our servers. Clearing your browser
                cache, switching devices, or using incognito mode will wipe your
                local test history and you&rsquo;ll no longer be able to reopen
                those attempts. You can also remove individual attempts (or all
                of them) from the Past Results section at any time.
              </p>
            </Section>

            <Section num="05" icon={Lock} title="Email Subscription &amp; Privacy" tone="lavender" index={4}>
              <p>
                If you opt in to receive updates while setting up a mock test,
                the email you provide is{' '}
                <span className="font-medium text-foreground">
                  stored securely
                </span>{' '}
                and used{' '}
                <span className="font-medium text-foreground">
                  only for promotional emails
                </span>{' '}
                from VIT RANKS - such as exam reminders, new mock tests, and
                platform announcements. We do not sell, rent, or share your
                email with third parties. You can request removal at any time by
                emailing{' '}
                <a
                  href="mailto:vitranks@malabarmatrix.in"
                  className="text-lavender underline underline-offset-4 transition-colors hover:text-lavender/80"
                >
                  vitranks@malabarmatrix.in
                </a>
                .
              </p>
            </Section>

            <Section num="06" icon={Info} title="Disclaimer" tone="coral" index={5}>
              <p>
                VIT RANKS is an independent, student-built platform and is not
                officially affiliated with VIT or the conducting body of VITEEE.
                Mock tests, scores, and analytics are provided purely for
                practice purposes. Always refer to the official VIT website for
                authoritative information regarding the exam, eligibility, and
                admissions.
              </p>
            </Section>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="mt-8 rounded-2xl border border-dashed border-border/60 bg-muted/10 p-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              By using this platform, you agree to the terms outlined above.
              Questions? Write to us at{' '}
              <a
                href="mailto:vitranks@malabarmatrix.in"
                className="text-coral underline underline-offset-4 transition-colors hover:text-coral/80"
              >
                vitranks@malabarmatrix.in
              </a>
              .
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
