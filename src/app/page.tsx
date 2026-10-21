import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { HowItWorks } from '@/components/how-it-works';
import { DualUIShowcase } from '@/components/dual-ui-showcase';
import { ImportantDates } from '@/components/important-dates';
import { FeedbackForm } from '@/components/feedback-form';
import { Testimonials } from '@/components/testimonials';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/json-ld';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DonationPopup } from '@/components/donation-popup';

export const metadata: Metadata = {
  title: "Free VITEEE Mock Tests & Rank Predictor 2027 | VIT RANKS",
  description:
    "Free VITEEE 2027 mock tests + VIT rank & college predictor. Enter your VITEEE rank to see which VIT campus and branch you can secure across all 5 fee categories. Live leaderboard, full syllabus. No signup, no paywall.",
  keywords: [
    // Rank / college predictor (high opportunity per search console)
    "viteee rank", "vit rank", "vit ranks", "vitee rank",
    "viteee rank predictor", "viteee rank predictor 2027",
    "vit rank predictor", "vit rank predictor 2027",
    "viteee college predictor", "viteee college predictor 2027",
    "vit college predictor", "vit college predictor 2027",
    "vitee college predictor", "college predictor viteee",
    "viteee predictor", "vit predictor",
    "viteee branch predictor", "vit branch predictor",
    "vit rank calculator", "viteee rank college predictor",
    "viteee college predictor free", "vit college predictor free",

    // VITEEE 2025 cutoffs / counselling data
    "viteee cutoff", "viteee 2025 cutoff", "viteee cutoff 2027",
    "vit cutoff", "vit category cutoff", "viteee category cutoff",
    "viteee marks vs rank", "viteee rank vs marks",
    "vit vellore cutoff", "vit chennai cutoff",
    "vit ap cutoff", "vit bhopal cutoff",

    // Registration & dates
    "viteee registration", "viteee registration 2027", "viteee registration form",
    "viteee registration last date", "viteee registration last date 2027",
    "viteee 2027", "viteee exam", "viteee exam date", "viteee exam date 2027",
    "viteee date", "viteee dates", "vit exam date",

    // Mock tests (primary platform offering)
    "viteee mock test", "viteee mock tests", "viteee free mock test",
    "viteee mock test 2027", "vit mock test", "vit mock test 2027",
    "vit free mock test", "vit ranks mock test",
    "viteee practice test online", "viteee practice test", "viteee sample paper",
    "viteee question paper", "viteee mocks", "viteee mock",

    // Previous year papers
    "viteee pyq", "viteee pyqs", "vit pyq", "vit pyqs",
    "viteee previous year question paper",
    "viteee previous year question papers", "viteee pyq chapterwise pdf",

    // Syllabus / pattern / marking
    "viteee syllabus", "viteee syllabus 2027", "viteee exam pattern",
    "does viteee have negative marking",

    // Slot booking / OTBS
    "viteee slot booking", "viteee slot booking date",
    "viteee otbs", "viteee otbs portal", "vit otbs portal",
    "viteee online test booking system",

    // Login / official portal
    "viteee login", "viteee.vit.ac.in", "viteee.vit.ac.in login",
    "viteee official website", "vit login", "vit registration",

    // Admit card / application
    "viteee admit card", "viteee admit card 2027",
    "viteee application", "viteee form",

    // VIT brand queries
    "vit", "viteee", "vitee", "vit exam", "vit entrance", "vit entrance exam",
    "vit entrance exam 2027", "vit eee", "vit vellore",
    "vit university", "vellore institute of technology",

    // NRI / category admissions
    "vit nri", "vit nri admission", "vit nri entrance",
    "vit nri entrance exam", "viteee nri", "vit category 2",
    "vit foreign students", "mpcea viteee", "vit mpcea", "bpcea viteee",

    // Admissions / counselling / fees
    "vit admission", "vit admission 2027", "vit b.tech admission",
    "vit b.tech", "vit fees", "vit counselling 2027",
    "viteee counselling", "viteee counselling 2027",

    // Campus-specific admissions
    "vit vellore admission", "vit chennai admission",
    "vit bhopal admission", "vit ap admission",

    // Preparation meta
    "viteee preparation", "viteee eligibility",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Free VITEEE Mock Tests & Rank Predictor 2027 | VIT RANKS",
    description:
      "Free VITEEE rank & college predictor + full-length mock tests for VIT Vellore, Chennai, AP & Bhopal. Based on 2025 cutoffs. No signup, no paywall.",
    url: '/',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VIT RANKS - Free VITEEE 2027 Mock Tests & Rank Predictor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free VITEEE Mock Tests & Rank Predictor 2027",
    description:
      "VITEEE rank & college predictor + free mock tests for VIT Vellore, Chennai, AP & Bhopal. No signup.",
    images: ['/hompage.png'],
  },
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <WebsiteJsonLd />
      <FAQJsonLd />
      <DonationPopup />
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <DualUIShowcase />
        <ImportantDates />
        <Testimonials />

        <section id="feedback" className="relative overflow-hidden py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-coral/10 via-peach/10 to-mint/10 blur-3xl" />
            <div className="absolute inset-0 bg-grid-fine opacity-[0.15]" />
          </div>

          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]">
                Tell us what&apos;s{' '}
                <span className="font-display italic gradient-text">missing</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Found a broken question? Want a feature? Just want to say hi?
                Drop it below - we reply.
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
