import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { HowItWorks } from '@/components/how-it-works';
import { ImportantDates } from '@/components/important-dates';
import { FeedbackForm } from '@/components/feedback-form';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/json-ld';
import { MessageCircle, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Free VITEEE Mock Tests 2026 | VIT RANKS",
  description:
    "Free, full-length VITEEE 2026 mock tests with instant analytics, a live leaderboard, and the complete syllabus. No signup. No paywall. Built by students, for VITEEE aspirants.",
  keywords: [
    // Core (highest impression count in search console)
    "viteee registration", "viteee registration 2026", "viteee registration form",
    "viteee registration last date", "viteee registration last date 2026",
    "viteee 2026", "viteee exam", "viteee exam date", "viteee exam date 2026",
    "viteee date", "viteee dates", "vit exam date",

    // Mock tests (primary platform offering)
    "viteee mock test", "viteee mock tests", "viteee free mock test",
    "viteee practice test online", "viteee practice test", "viteee sample paper",
    "viteee question paper",

    // Previous year papers
    "viteee pyq", "viteee pyqs", "viteee previous year question paper",
    "viteee previous year question papers", "viteee pyq chapterwise pdf",

    // Syllabus / pattern / marking
    "viteee syllabus", "viteee syllabus 2026", "viteee exam pattern",
    "does viteee have negative marking",

    // Slot booking / OTBS
    "viteee slot booking", "viteee slot booking date",
    "viteee otbs", "viteee otbs portal", "vit otbs portal",
    "viteee online test booking system",

    // Login / official portal
    "viteee login", "viteee.vit.ac.in", "viteee.vit.ac.in login",
    "viteee official website", "vit login", "vit registration",

    // Admit card / application
    "viteee admit card", "viteee admit card 2026",
    "viteee application", "viteee form",

    // VIT brand queries
    "vit entrance exam", "vit eee", "vit vellore",
    "vit university", "vellore institute of technology",

    // Preparation meta
    "viteee preparation", "viteee eligibility",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Free VITEEE Mock Tests 2026 | VIT RANKS",
    description:
      "Full-length VITEEE 2026 mock tests, live leaderboard, and syllabus — all free, no signup. Join the #1 VITEEE student community.",
    url: '/',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VIT RANKS - Free VITEEE 2026 Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free VITEEE Mock Tests 2026",
    description:
      "Full-length VITEEE mock tests, live leaderboard, and syllabus — free, no signup.",
    images: ['/hompage.png'],
  },
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <WebsiteJsonLd />
      <FAQJsonLd />
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ImportantDates />

        <section id="feedback" className="relative overflow-hidden py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-coral/10 via-peach/10 to-mint/10 blur-3xl" />
            <div className="absolute inset-0 bg-grid-fine opacity-[0.15]" />
          </div>

          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <MessageCircle className="h-3.5 w-3.5" />
                We actually read these
              </div>
              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]">
                Tell us what&apos;s{' '}
                <span className="font-display italic gradient-text">missing</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Found a broken question? Want a feature? Just want to say hi?
                Drop it below — we reply.
              </p>
            </div>

            <div className="relative mx-auto max-w-2xl">
              <div className="shimmer-border rounded-3xl">
                <div className="relative rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
                  <FeedbackForm />
                </div>
              </div>
            </div>

            {/* Donate nudge */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg backdrop-blur-xl md:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-coral/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-mint/15 blur-3xl" />

                <div className="relative z-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-coral">
                      <Heart className="h-3 w-3" />
                      Or, support us
                    </div>
                    <p className="mt-3 text-lg font-semibold tracking-tight md:text-xl">
                      Not in a feedback mood? Buy us a{' '}
                      <span className="font-display italic text-coral">cup of chai</span>{' '}
                      instead.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Every ₹ goes straight into keeping the mock tests free and ad-free.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="shimmer-border group h-11 shrink-0 gap-2 rounded-full bg-gradient-to-r from-coral to-peach px-6 text-sm font-semibold text-plum-deep shadow-lg shadow-coral/25 hover:from-coral hover:to-peach"
                  >
                    <Link href="/donate">
                      <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Donate
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
