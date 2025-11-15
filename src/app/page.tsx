import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/ui/animated-hero';
import { CampusCards } from '@/components/campus-cards';
import { ImportantDates } from '@/components/important-dates';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <CampusCards />
        <ImportantDates />
      </main>
      <Footer />
    </div>
  );
}
