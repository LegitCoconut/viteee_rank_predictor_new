import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { CampusCards } from '@/components/campus-cards';
import { ImportantDates } from '@/components/important-dates';
import { FeedbackForm } from '@/components/feedback-form';

export const metadata: Metadata = {
  title: "VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS",
  description: "Predict your VITEEE rank, take free mock tests, and access 2026 exam resources. Join the student community for VITEEE preparation without signups.",
  keywords: [
    "viteee 2026", "viteee registration", "viteee registration 2026", "viteee exam", "vit",
    "viteee exam date", "viteee 2026 registration date", "viteee exam date 2026", "jee",
    "viteee form", "viteee 2025", "viteee application", "viteee fees", "bitsat",
    "viteee entrance exam", "vellore", "viteee college", "vit vellore", "jee mains",
    "bitsat 2026", "viteee registration last date", "viteee syllabus",
    "viteee 2026 registration last date", "vit registration", "what is viteee",
    "viteee.vit.ac.in 2026", "viteee admit card 2025", "cucet", "vit eee",
    "vit application form 2025 last date", "viteee preparation books", "amity university",
    "best engineering colleges in india", "niser", "viteee exam pattern and cutoff",
    "jee main 2026 registration"
  ],
  openGraph: {
    title: "VITEEE Rank Predictor 2026 & Free Mock Tests | VIT RANKS",
    description: "Predict your VITEEE rank, take free mock tests, and access 2026 exam resources. Join the student community for VITEEE preparation without signups.",
    images: ["/hompage.png"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
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
