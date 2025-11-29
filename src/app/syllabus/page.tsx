import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SyllabusSection } from '@/components/syllabus-section';
import { MockTestPattern } from '@/components/mock-test-pattern';
import { SyllabusDownloads } from '@/components/syllabus-downloads';
import { AIChat } from '@/components/ai-chat';
import { syllabus } from '@/lib/data/syllabus-data';

export default function SyllabusPage() {
  const syllabusContext = JSON.stringify(syllabus);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <SyllabusSection />
        <SyllabusDownloads />
        <MockTestPattern />
        <AIChat syllabusContext={syllabusContext} />
      </main>
      <Footer />
    </div>
  );
}
