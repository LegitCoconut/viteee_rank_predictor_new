import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SyllabusSection } from '@/components/syllabus-section';

export default function SyllabusPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <SyllabusSection />
      </main>
      <Footer />
    </div>
  );
}
