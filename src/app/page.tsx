import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { CampusCards } from '@/components/campus-cards';
import { ImportantDates } from '@/components/important-dates';
import { FeedbackForm } from '@/components/feedback-form';

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
