import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { CampusCards } from '@/components/campus-cards';
import { ImportantDates } from '@/components/important-dates';
import { FeedbackForm } from '@/components/feedback-form';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: "VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS",
  description: "Predict your VITEEE 2026 rank, take free mock tests, view syllabus, exam pattern & cutoff marks. #1 free resource for VITEEE preparation - no signup required. Get campus-wise cutoff for VIT Vellore, Chennai, AP & Bhopal.",
  keywords: [
    "viteee 2026", "viteee rank predictor", "viteee mock test", "viteee exam", "vit",
    "viteee exam date 2026", "viteee registration 2026", "viteee syllabus 2026",
    "viteee exam pattern", "viteee cutoff 2026", "vit entrance exam",
    "viteee preparation", "viteee free mock test", "viteee practice test online",
    "vit vellore admission 2026", "viteee college predictor", "vit rank predictor",
    "viteee registration last date 2026", "viteee admit card 2026",
    "viteee previous year papers", "viteee sample papers", "viteee eligibility",
    "vit campus ranking", "viteee slot booking", "viteee counselling 2026",
    "viteee expected cutoff", "vit bhopal cutoff", "vit chennai cutoff",
    "vit ap cutoff", "vit vellore cutoff",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS",
    description: "Predict your VITEEE 2026 rank, take free mock tests, view syllabus & exam pattern. No signup required. Join the #1 VITEEE student community.",
    url: '/',
    images: [
      {
        url: '/hompage.png',
        width: 1200,
        height: 630,
        alt: 'VIT RANKS - VITEEE 2026 Rank Predictor and Free Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "VITEEE Rank Predictor 2026 & Free Mock Tests",
    description: "Predict your VITEEE 2026 rank, take free mock tests, view syllabus & exam pattern. No signup required.",
    images: ['/hompage.png'],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <WebsiteJsonLd />
      <FAQJsonLd />
      <Header />
      <main className="flex-1">
        <Hero />
        <CampusCards />
        <ImportantDates />
        <section id="feedback" className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Feedback
            </h2>
            <div className="max-w-2xl mx-auto">
              <FeedbackForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
