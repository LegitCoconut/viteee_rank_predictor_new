import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Globe,
  Mail,
  BookOpen,
  Trophy,
  Lock,
  Info,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms, conditions and privacy information for VIT RANKS — a VITEEE rank predictor and mock test platform owned and managed by Malabar Matrix.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <ShieldCheck className="h-4 w-4" />
                Transparency Matters
              </div>
              <h1 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">
                Terms &amp; Conditions
              </h1>
              <p className="text-lg text-muted-foreground mt-3">
                A clear, no-jargon overview of the team behind this platform,
                the origins of our content, and how we responsibly manage the
                little information you provide.
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid gap-6">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-headline">
                        About the Website
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        VIT RANKS is owned and managed by{' '}
                        <Link
                          href="https://malabarmatrix.site"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          Malabar Matrix
                        </Link>
                        . We build free, no-signup tools to help VITEEE
                        aspirants prepare with confidence. For any queries,
                        feedback, or concerns, you can reach us at{' '}
                        <a
                          href="mailto:vitranks@malabarmatrix.site"
                          className="text-primary underline underline-offset-4 hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Mail className="h-4 w-4" />
                          vitranks@malabarmatrix.site
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-headline">
                        Question Sources
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        All mock test questions on this platform are sourced
                        from <span className="font-medium text-foreground">free and publicly available material on the internet</span>{' '}
                        — including sample papers, previous-year question sets,
                        and open educational resources. We do not claim
                        ownership of the underlying question content. If you
                        are a rights holder and believe any content should be
                        removed, please email us and we will act promptly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-headline">
                        Name &amp; Leaderboard
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        When you start a mock test, we ask for a name. This
                        name is used solely to display your score on the public{' '}
                        <Link
                          href="/mocktest#leaderboard"
                          className="text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          leaderboard
                        </Link>
                        . Please avoid entering sensitive information — you can
                        use a nickname or initials if you prefer.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-headline">
                        Email Subscription &amp; Privacy
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        If you opt in to receive updates while setting up a
                        mock test, the email you provide is{' '}
                        <span className="font-medium text-foreground">stored securely</span>{' '}
                        and used <span className="font-medium text-foreground">only for promotional emails</span>{' '}
                        from VIT RANKS — such as exam reminders, new mock
                        tests, and platform announcements. We do not sell,
                        rent, or share your email with third parties. You can
                        request removal at any time by emailing{' '}
                        <a
                          href="mailto:vitranks@malabarmatrix.site"
                          className="text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          vitranks@malabarmatrix.site
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold font-headline">
                        Disclaimer
                      </h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        VIT RANKS is an independent, student-built platform and
                        is not officially affiliated with VIT or the conducting
                        body of VITEEE. Rank predictions, cutoffs, and score
                        estimates are indicative only and based on publicly
                        available historical data. Always refer to the official
                        VIT website for authoritative information regarding
                        admissions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground pt-4">
                By using this platform, you agree to the terms outlined above.
                Questions? Write to us at{' '}
                <a
                  href="mailto:vitranks@malabarmatrix.site"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  vitranks@malabarmatrix.site
                </a>
                .
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
