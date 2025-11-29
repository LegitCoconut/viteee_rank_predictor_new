import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MockTestPattern } from '@/components/mock-test-pattern';

export default function MockTestPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <MockTestPattern />
      </main>
      <Footer />
    </div>
  );
}
